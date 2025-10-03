import { Check, CheckCircle2, Loader2, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ConfettiOptions, SliderCaptchaConfig } from "../types";

// Dynamic import for confetti to avoid SSR issues
const triggerConfetti = async (options: ConfettiOptions) => {
  try {
    const confetti = (await import("canvas-confetti")).default;
    confetti(options);
  } catch {
    // Silently fail if confetti fails to load
  }
};

// Pexels API configuration
const PEXELS_API_KEY =
  "w8hqhT3wZxwABO6SyD0Vjhvq8BjfkST7k52athhdqsDcefxdPapFyS5m";
const PEXELS_API_URL = "https://api.pexels.com/v1/search";

interface PexelsPhoto {
  id: number;
  src: {
    medium: string;
  };
}

interface PexelsResponse {
  photos: PexelsPhoto[];
}

interface SliderCaptchaProps {
  width?: number;
  height?: number;
  config?: SliderCaptchaConfig;
  darkMode?: boolean;
  onValidate?: (isValid: boolean, position: number) => void;
  onPositionChange?: (position: number) => void;
  disabled?: boolean;
  showSuccessAnimation?: boolean;
  showConfetti?: boolean;
  confettiOptions?: ConfettiOptions;
}

interface PuzzleState {
  targetX: number;
  targetY: number;
  sliderPosition: number;
  isDragging: boolean;
  backgroundImage: string;
  puzzlePath: Path2D;
  rotation: number;
  pieceType: 'classic' | 'modern' | 'complex';
}

interface SecurityMetrics {
  startTime: number;
  endTime: number;
  mouseMovements: Array<{ x: number, y: number, time: number }>;
  totalDistance: number;
  averageSpeed: number;
  hesitationCount: number;
}

export const SliderCaptcha: React.FC<SliderCaptchaProps> = ({
  width: propWidth,
  height = 180,
  config = {},
  darkMode = false,
  onValidate,
  onPositionChange,
  disabled = false,
  showSuccessAnimation = false,
  showConfetti = false,
  confettiOptions = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliderCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  // State to track actual canvas dimensions
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: propWidth || 400,
    height,
  });

  // Use the measured width from canvasDimensions
  const width = canvasDimensions.width;

  const {
    pieceSize = 42,
    tolerance = 12,
    backgroundImage,
    backgroundImages,
    enableShadow = true,
  } = config;

  const [puzzleState, setPuzzleState] = useState<PuzzleState>({
    targetX: 0,
    targetY: 0,
    sliderPosition: 0,
    isDragging: false,
    backgroundImage: "",
    puzzlePath: new Path2D(),
    rotation: 0,
    pieceType: 'classic',
  });

  const [isValidated, setIsValidated] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [showFailedAttempt, setShowFailedAttempt] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Security tracking state
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    startTime: 0,
    endTime: 0,
    mouseMovements: [],
    totalDistance: 0,
    averageSpeed: 0,
    hesitationCount: 0,
  });

  // Cache for loaded images to prevent duplicate loading
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const currentImageUrl = useRef<string>("");

  // ResizeObserver to measure container width
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      const newWidth = propWidth || Math.max(rect.width || 400, 320);
      setCanvasDimensions({
        width: newWidth,
        height,
      });
    };

    // Initial measurement
    setTimeout(() => {
      updateDimensions();
    }, 0);

    // Use ResizeObserver if available, otherwise use window resize
    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(() => {
        updateDimensions();
      });

      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
      };
    } else {
      // Fallback to window resize
      const handleResize = () => updateDimensions();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [propWidth, height]);

  // Enhanced gradient generator for default backgrounds
  const generateDefaultBackground = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Create a more sophisticated gradient background
      const gradients = [
        // Blue to purple
        () => {
          const gradient = ctx.createLinearGradient(0, 0, width, height);
          gradient.addColorStop(0, darkMode ? "#1e3a8a" : "#3b82f6");
          gradient.addColorStop(0.5, darkMode ? "#7c3aed" : "#8b5cf6");
          gradient.addColorStop(1, darkMode ? "#1e1b4b" : "#6366f1");
          return gradient;
        },
        // Green to teal
        () => {
          const gradient = ctx.createLinearGradient(0, 0, width, height);
          gradient.addColorStop(0, darkMode ? "#065f46" : "#10b981");
          gradient.addColorStop(0.5, darkMode ? "#0f766e" : "#14b8a6");
          gradient.addColorStop(1, darkMode ? "#164e63" : "#06b6d4");
          return gradient;
        },
        // Orange to red
        () => {
          const gradient = ctx.createLinearGradient(0, 0, width, height);
          gradient.addColorStop(0, darkMode ? "#9a3412" : "#f97316");
          gradient.addColorStop(0.5, darkMode ? "#dc2626" : "#ef4444");
          gradient.addColorStop(1, darkMode ? "#7c2d12" : "#f59e0b");
          return gradient;
        },
      ];

      const selectedGradient =
        gradients[Math.floor(Math.random() * gradients.length)]();
      ctx.fillStyle = selectedGradient;
      ctx.fillRect(0, 0, width, height);

      // Add geometric pattern overlay
      ctx.fillStyle = darkMode
        ? "rgba(255,255,255,0.03)"
        : "rgba(255,255,255,0.1)";

      // Create a modern geometric pattern
      for (let i = 0; i < width + 100; i += 60) {
        for (let j = 0; j < height + 100; j += 60) {
          ctx.save();
          ctx.translate(i, j);
          ctx.rotate((Math.PI / 180) * 45);
          ctx.fillRect(-15, -1, 30, 2);
          ctx.fillRect(-1, -15, 2, 30);
          ctx.restore();
        }
      }

      // Add subtle noise for texture (stable noise, not random every frame)
      // Comment out or remove the noise to prevent constant re-rendering
      // const imageData = ctx.getImageData(0, 0, width, height);
      // const data = imageData.data;
      // for (let i = 0; i < data.length; i += 4) {
      //   const noise = (Math.random() - 0.5) * 10;
      //   data[i] = Math.max(0, Math.min(255, data[i] + noise));
      //   data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      //   data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      // }
      // ctx.putImageData(imageData, 0, 0);
    },
    [width, height, darkMode]
  );

  // Fetch random photo from Pexels API
  const fetchPexelsPhoto = useCallback(async (): Promise<string> => {
    try {
      setIsLoadingImage(true);

      const queries = [
        "nature landscape",
        "modern architecture",
        "abstract art",
        "geometric patterns",
        "minimal design",
        "ocean waves",
        "mountain vista",
        "urban skyline",
        "forest path",
        "sunset clouds",
        "flower garden",
        "space nebula",
      ];

      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      const response = await fetch(
        `${PEXELS_API_URL}?query=${encodeURIComponent(
          randomQuery
        )}&per_page=20&orientation=landscape`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch image");

      const data: PexelsResponse = await response.json();
      if (data.photos && data.photos.length > 0) {
        const randomPhoto =
          data.photos[Math.floor(Math.random() * data.photos.length)];
        return randomPhoto.src.medium;
      }

      throw new Error("No images found");
    } catch {
      // Silently fail and return empty string
      return "";
    } finally {
      setIsLoadingImage(false);
    }
  }, []);

  // Enhanced puzzle piece creation with multiple types and rotation support
  const createPuzzlePath = useCallback(
    (pieceType: 'classic' | 'modern' | 'complex' = 'classic', rotation: number = 0): Path2D => {
      const path = new Path2D();
      const size = pieceSize;

      // Always create path at (0, 0) - positioning will be handled during drawing
      const x = 0;
      const y = 0;

      if (pieceType === 'modern') {
        // Modern geometric piece
        const cornerRadius = size * 0.15;
        const indentSize = size * 0.25;

        // Start from top-left with rounded corner
        let currentX = x;
        let currentY = y;

        // Top edge with center indent
        path.moveTo(currentX + cornerRadius, currentY);
        path.lineTo(currentX + size * 0.4, currentY);
        path.quadraticCurveTo(currentX + size * 0.5, currentY + indentSize * 0.5, currentX + size * 0.5, currentY);
        path.quadraticCurveTo(currentX + size * 0.6, currentY + indentSize * 0.5, currentX + size * 0.6, currentY);
        path.lineTo(currentX + size - cornerRadius, currentY);
        path.quadraticCurveTo(currentX + size, currentY, currentX + size, currentY + cornerRadius);

        // Right edge with center indent
        path.lineTo(currentX + size, currentY + size * 0.4);
        path.quadraticCurveTo(currentX + size - indentSize * 0.5, currentY + size * 0.5, currentX + size, currentY + size * 0.5);
        path.quadraticCurveTo(currentX + size - indentSize * 0.5, currentY + size * 0.6, currentX + size, currentY + size * 0.6);
        path.lineTo(currentX + size, currentY + size - cornerRadius);
        path.quadraticCurveTo(currentX + size, currentY + size, currentX + size - cornerRadius, currentY + size);

        // Bottom edge with center indent
        path.lineTo(currentX + size * 0.6, currentY + size);
        path.quadraticCurveTo(currentX + size * 0.5, currentY + size - indentSize * 0.5, currentX + size * 0.5, currentY + size);
        path.quadraticCurveTo(currentX + size * 0.4, currentY + size - indentSize * 0.5, currentX + size * 0.4, currentY + size);
        path.lineTo(currentX + cornerRadius, currentY + size);
        path.quadraticCurveTo(currentX, currentY + size, currentX, currentY + size - cornerRadius);

        // Left edge with center indent
        path.lineTo(currentX, currentY + size * 0.6);
        path.quadraticCurveTo(currentX + indentSize * 0.5, currentY + size * 0.5, currentX, currentY + size * 0.5);
        path.quadraticCurveTo(currentX + indentSize * 0.5, currentY + size * 0.4, currentX, currentY + size * 0.4);
        path.lineTo(currentX, currentY + cornerRadius);
        path.quadraticCurveTo(currentX, currentY, currentX + cornerRadius, currentY);

      } else if (pieceType === 'complex') {
        // Complex interlocking piece
        const tabSize = size * 0.18;
        const tabRadius = tabSize * 0.7;
        const smallTabSize = size * 0.12;
        const smallTabRadius = smallTabSize * 0.8;

        path.moveTo(x, y);

        // Top edge - alternating large and small tabs
        path.lineTo(x + size * 0.25, y);
        // Large tab
        path.arc(x + size * 0.25 + smallTabRadius, y - smallTabSize, smallTabRadius, Math.PI, 0, false);
        path.lineTo(x + size * 0.5, y);
        // Large blank
        path.arc(x + size * 0.5, y + tabSize, tabRadius, Math.PI, 0, true);
        path.lineTo(x + size * 0.75, y);
        // Small tab
        path.arc(x + size * 0.75 + smallTabRadius, y - smallTabSize, smallTabRadius, Math.PI, 0, false);
        path.lineTo(x + size, y);

        // Right edge - complex pattern
        path.lineTo(x + size, y + size * 0.2);
        path.arc(x + size + tabSize, y + size * 0.2 + tabRadius, tabRadius, -Math.PI / 2, Math.PI / 2, false);
        path.lineTo(x + size, y + size * 0.5);
        path.arc(x + size - smallTabSize, y + size * 0.5, smallTabRadius, -Math.PI / 2, Math.PI / 2, true);
        path.lineTo(x + size, y + size * 0.8);
        path.arc(x + size + smallTabSize, y + size * 0.8 + smallTabRadius, smallTabRadius, -Math.PI / 2, Math.PI / 2, false);
        path.lineTo(x + size, y + size);

        // Bottom edge - mirrored top edge
        path.lineTo(x + size * 0.75, y + size);
        path.arc(x + size * 0.75 - smallTabRadius, y + size + smallTabSize, smallTabRadius, 0, Math.PI, false);
        path.lineTo(x + size * 0.5, y + size);
        path.arc(x + size * 0.5, y + size - tabSize, tabRadius, 0, Math.PI, true);
        path.lineTo(x + size * 0.25, y + size);
        path.arc(x + size * 0.25 - smallTabRadius, y + size + smallTabSize, smallTabRadius, 0, Math.PI, false);
        path.lineTo(x, y + size);

        // Left edge - mirrored right edge
        path.lineTo(x, y + size * 0.8);
        path.arc(x - smallTabSize, y + size * 0.8 - smallTabRadius, smallTabRadius, Math.PI / 2, -Math.PI / 2, false);
        path.lineTo(x, y + size * 0.5);
        path.arc(x + smallTabSize, y + size * 0.5, smallTabRadius, Math.PI / 2, -Math.PI / 2, true);
        path.lineTo(x, y + size * 0.2);
        path.arc(x - tabSize, y + size * 0.2 - tabRadius, tabRadius, Math.PI / 2, -Math.PI / 2, false);
        path.lineTo(x, y);

      } else {
        // Classic puzzle piece (enhanced)
        const tabSize = size * 0.22;
        const tabRadius = tabSize * 0.75;

        // Randomly decide which edges have tabs vs blanks, but ensure interlocking
        const topPattern = Math.random() > 0.5 ? 1 : -1; // 1 = tab, -1 = blank
        const rightPattern = Math.random() > 0.5 ? 1 : -1;
        const bottomPattern = Math.random() > 0.5 ? 1 : -1;
        const leftPattern = Math.random() > 0.5 ? 1 : -1;

        path.moveTo(x, y);

        // Top edge
        if (topPattern > 0) {
          path.lineTo(x + size * 0.35, y);
          path.arc(x + size * 0.5, y - tabRadius * topPattern, tabRadius, Math.PI, 0, false);
          path.lineTo(x + size * 0.65, y);
          path.arc(x + size * 0.75, y - (tabRadius * 0.6) * topPattern, tabRadius * 0.6, Math.PI, 0, false);
          path.lineTo(x + size, y);
        } else {
          path.lineTo(x + size * 0.35, y);
          path.arc(x + size * 0.5, y + tabRadius * Math.abs(topPattern), tabRadius, Math.PI, 0, true);
          path.lineTo(x + size * 0.65, y);
          path.arc(x + size * 0.75, y + (tabRadius * 0.6) * Math.abs(topPattern), tabRadius * 0.6, Math.PI, 0, true);
          path.lineTo(x + size, y);
        }

        // Right edge
        if (rightPattern > 0) {
          path.lineTo(x + size, y + size * 0.35);
          path.arc(x + size + tabRadius * rightPattern, y + size * 0.5, tabRadius, -Math.PI / 2, Math.PI / 2, false);
          path.lineTo(x + size, y + size * 0.65);
          path.arc(x + size + (tabRadius * 0.6) * rightPattern, y + size * 0.75, tabRadius * 0.6, -Math.PI / 2, Math.PI / 2, false);
          path.lineTo(x + size, y + size);
        } else {
          path.lineTo(x + size, y + size * 0.35);
          path.arc(x + size - tabRadius * Math.abs(rightPattern), y + size * 0.5, tabRadius, -Math.PI / 2, Math.PI / 2, true);
          path.lineTo(x + size, y + size * 0.65);
          path.arc(x + size - (tabRadius * 0.6) * Math.abs(rightPattern), y + size * 0.75, tabRadius * 0.6, -Math.PI / 2, Math.PI / 2, true);
          path.lineTo(x + size, y + size);
        }

        // Bottom edge (mirrored top)
        if (bottomPattern > 0) {
          path.lineTo(x + size * 0.65, y + size);
          path.arc(x + size * 0.5, y + size + tabRadius * bottomPattern, tabRadius, 0, Math.PI, false);
          path.lineTo(x + size * 0.35, y + size);
          path.arc(x + size * 0.25, y + size + (tabRadius * 0.6) * bottomPattern, tabRadius * 0.6, 0, Math.PI, false);
          path.lineTo(x, y + size);
        } else {
          path.lineTo(x + size * 0.65, y + size);
          path.arc(x + size * 0.5, y + size - tabRadius * Math.abs(bottomPattern), tabRadius, 0, Math.PI, true);
          path.lineTo(x + size * 0.35, y + size);
          path.arc(x + size * 0.25, y + size - (tabRadius * 0.6) * Math.abs(bottomPattern), tabRadius * 0.6, 0, Math.PI, true);
          path.lineTo(x, y + size);
        }

        // Left edge (mirrored right)
        if (leftPattern > 0) {
          path.lineTo(x, y + size * 0.65);
          path.arc(x - tabRadius * leftPattern, y + size * 0.5, tabRadius, Math.PI / 2, -Math.PI / 2, false);
          path.lineTo(x, y + size * 0.35);
          path.arc(x - (tabRadius * 0.6) * leftPattern, y + size * 0.25, tabRadius * 0.6, Math.PI / 2, -Math.PI / 2, false);
          path.lineTo(x, y);
        } else {
          path.lineTo(x, y + size * 0.65);
          path.arc(x + tabRadius * Math.abs(leftPattern), y + size * 0.5, tabRadius, Math.PI / 2, -Math.PI / 2, true);
          path.lineTo(x, y + size * 0.35);
          path.arc(x + (tabRadius * 0.6) * Math.abs(leftPattern), y + size * 0.25, tabRadius * 0.6, Math.PI / 2, -Math.PI / 2, true);
          path.lineTo(x, y);
        }
      }

      path.closePath();

      // Apply rotation if specified
      if (rotation !== 0) {
        const centerX = size / 2;
        const centerY = size / 2;
        const rotatedPath = new Path2D();
        const transform = new DOMMatrix();
        transform.translateSelf(centerX, centerY);
        transform.rotateSelf(rotation);
        transform.translateSelf(-centerX, -centerY);
        rotatedPath.addPath(path, transform);
        return rotatedPath;
      }

      return path;
    },
    [pieceSize]
  );

  // Initialize puzzle - using refs to avoid dependency changes
  const initializePuzzleRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    initializePuzzleRef.current = async () => {
      const targetX = Math.random() * (width - pieceSize - 80) + 60;
      const targetY = Math.random() * (height - pieceSize - 40) + 20;

      let bgImage = backgroundImage;

      if (!bgImage) {
        if (backgroundImages && backgroundImages.length > 0) {
          bgImage =
            backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
        } else {
          bgImage = await fetchPexelsPhoto();
        }
      }

      const pieceTypes: ('classic' | 'modern' | 'complex')[] = ['classic', 'modern', 'complex'];
      const randomPieceType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
      const randomRotation = Math.floor(Math.random() * 4) * 90; // 0, 90, 180, or 270 degrees

      const puzzlePath = createPuzzlePath(randomPieceType, randomRotation);

      // Clear image cache and current URL when initializing new puzzle
      imageCache.current.clear();
      currentImageUrl.current = "";

      setPuzzleState({
        targetX,
        targetY,
        sliderPosition: 0, // Start piece at the beginning
        isDragging: false,
        backgroundImage: bgImage || "",
        puzzlePath,
        rotation: randomRotation,
        pieceType: randomPieceType,
      });

      // Reset UI states but keep success animation if it's currently showing
      setIsValidated(false);
      setShowFailedAttempt(false);
      setDragOffset(0);
      // Don't reset showSuccess here - let it be managed by the validation function
    };
  }, [
    width,
    height,
    pieceSize,
    backgroundImage,
    backgroundImages,
    createPuzzlePath,
    fetchPexelsPhoto,
  ]);

  const initializePuzzle = useCallback(async () => {
    if (initializePuzzleRef.current) {
      await initializePuzzleRef.current();
    }
  }, []);

  // Enhanced background drawing
  const drawBackground = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (puzzleState.backgroundImage) {
      const img = new Image();
      img.onload = () => {
        // Draw image with subtle overlay
        ctx.drawImage(img, 0, 0, width, height);

        // Add subtle overlay for better contrast
        const overlay = ctx.createLinearGradient(0, 0, width, height);
        overlay.addColorStop(
          0,
          darkMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.05)"
        );
        overlay.addColorStop(
          1,
          darkMode ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.05)"
        );
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, width, height);

        drawPuzzleHole(ctx);
      };
      img.crossOrigin = "anonymous";
      img.src = puzzleState.backgroundImage;
    } else {
      generateDefaultBackground(ctx);
      drawPuzzleHole(ctx);
    }
  }, [
    width,
    height,
    puzzleState.backgroundImage,
    puzzleState.puzzlePath,
    generateDefaultBackground,
    darkMode,
  ]);

  // Enhanced puzzle hole drawing
  const drawPuzzleHole = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.save();

      // Create hole path translated to target position
      const holePath = new Path2D();
      const transform = new DOMMatrix();
      transform.translateSelf(puzzleState.targetX, puzzleState.targetY);
      holePath.addPath(puzzleState.puzzlePath, transform);

      // Create hole with better shadow effect
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill(holePath);

      // Fill hole with white background for better visibility
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "white";
      ctx.fill(holePath);

      // Add sophisticated hole border
      ctx.globalCompositeOperation = "source-over";

      // Outer glow effect
      if (enableShadow) {
        ctx.shadowColor = darkMode ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        ctx.strokeStyle = darkMode
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.1)";
        ctx.lineWidth = 4;
        ctx.stroke(holePath);
      }

      // Main border
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
      ctx.lineWidth = 2;
      ctx.stroke(holePath);

      // Inner highlight
      ctx.strokeStyle = darkMode
        ? "rgba(255,255,255,0.1)"
        : "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke(holePath);

      ctx.restore();
    },
    [puzzleState.puzzlePath, puzzleState.targetX, puzzleState.targetY, darkMode, enableShadow]
  );

  // Enhanced slider piece drawing
  const drawSliderPiece = useCallback(() => {
    const canvas = sliderCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const pieceX = puzzleState.sliderPosition;
    const pieceY = puzzleState.targetY;

    // Create piece path translated to current position
    const piecePath = new Path2D();
    const transform = new DOMMatrix();
    transform.translateSelf(pieceX, pieceY);
    piecePath.addPath(puzzleState.puzzlePath, transform);

    ctx.save();

    // Enhanced shadow for piece
    if (enableShadow) {
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
    }

    if (puzzleState.backgroundImage) {
      // Check if image is already cached
      const cachedImage = imageCache.current.get(puzzleState.backgroundImage);

      if (cachedImage && cachedImage.complete) {
        // Use cached image immediately
        drawPieceWithImage(ctx, cachedImage, piecePath, pieceX, pieceY);
      } else if (currentImageUrl.current !== puzzleState.backgroundImage) {
        // Only start loading if this is a new image URL
        currentImageUrl.current = puzzleState.backgroundImage;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Cache the loaded image
          imageCache.current.set(puzzleState.backgroundImage, img);

          // Only draw if this is still the current image
          if (currentImageUrl.current === puzzleState.backgroundImage) {
            drawPieceWithImage(ctx, img, piecePath, pieceX, pieceY);
          }
        };
        img.src = puzzleState.backgroundImage;
      }
    } else {
      // Enhanced gradient for piece when no image
      const gradient = ctx.createRadialGradient(
        pieceX + pieceSize / 2,
        pieceY + pieceSize / 2,
        0,
        pieceX + pieceSize / 2,
        pieceY + pieceSize / 2,
        pieceSize
      );

      if (isValidated) {
        gradient.addColorStop(0, "#22c55e");
        gradient.addColorStop(1, "#15803d");
      } else if (puzzleState.isDragging) {
        gradient.addColorStop(0, "#3b82f6");
        gradient.addColorStop(1, "#1d4ed8");
      } else {
        gradient.addColorStop(0, darkMode ? "#60a5fa" : "#3b82f6");
        gradient.addColorStop(1, darkMode ? "#3b82f6" : "#1d4ed8");
      }

      ctx.fillStyle = gradient;
      ctx.fill(piecePath);

      // Enhanced piece border
      ctx.strokeStyle = isValidated
        ? "#22c55e"
        : puzzleState.isDragging
          ? "#3b82f6"
          : darkMode
            ? "#60a5fa"
            : "#3b82f6";
      ctx.lineWidth = 3;
      ctx.stroke(piecePath);
    }

    ctx.restore();
  }, [
    puzzleState.sliderPosition,
    puzzleState.targetY,
    puzzleState.targetX,
    puzzleState.backgroundImage,
    puzzleState.isDragging,
    puzzleState.puzzlePath,
    pieceSize,
    darkMode,
    enableShadow,
    width,
    height,
    isValidated,
  ]);

  // Helper function to draw piece with image
  const drawPieceWithImage = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      piecePath: Path2D,
      pieceX: number,
      pieceY: number
    ) => {
      ctx.save();
      ctx.clip(piecePath);

      const offsetX = puzzleState.targetX - pieceX;
      const offsetY = 0;

      ctx.drawImage(img, offsetX, offsetY, width, height);

      // Add subtle overlay to piece
      const pieceOverlay = ctx.createLinearGradient(
        pieceX,
        pieceY,
        pieceX + pieceSize,
        pieceY + pieceSize
      );

      if (isValidated) {
        pieceOverlay.addColorStop(0, "rgba(34, 197, 94, 0.2)");
        pieceOverlay.addColorStop(1, "rgba(22, 163, 74, 0.3)");
      } else if (puzzleState.isDragging) {
        pieceOverlay.addColorStop(0, "rgba(59, 130, 246, 0.2)");
        pieceOverlay.addColorStop(1, "rgba(37, 99, 235, 0.3)");
      } else {
        pieceOverlay.addColorStop(0, "rgba(255, 255, 255, 0.1)");
        pieceOverlay.addColorStop(1, "rgba(0, 0, 0, 0.1)");
      }

      ctx.fillStyle = pieceOverlay;
      ctx.fill(piecePath);

      ctx.restore();

      // Enhanced piece border
      ctx.strokeStyle = isValidated
        ? "#22c55e"
        : puzzleState.isDragging
          ? "#3b82f6"
          : darkMode
            ? "#60a5fa"
            : "#3b82f6";
      ctx.lineWidth = 3;
      ctx.stroke(piecePath);

      // Inner highlight
      ctx.strokeStyle = isValidated ? "#86efac" : "#bfdbfe";
      ctx.lineWidth = 1;
      ctx.stroke(piecePath);
    },
    [
      puzzleState.targetX,
      puzzleState.isDragging,
      pieceSize,
      width,
      height,
      isValidated,
      darkMode,
    ]
  );

  // Enhanced validation with security features
  const validatePosition = useCallback(
    (position: number) => {
      const endTime = Date.now();
      const totalTime = securityMetrics.startTime > 0 ? endTime - securityMetrics.startTime : 0;

      // Position accuracy check (most important)
      const positionValid = Math.abs(position - puzzleState.targetX) <= tolerance;

      // Security checks (more lenient)
      const securityChecks = {
        // Time-based validation (too fast = suspicious, but allow if startTime wasn't set)
        timeValid: securityMetrics.startTime === 0 || (totalTime > 200 && totalTime < 60000), // Between 0.2s and 60s

        // Movement pattern analysis (relaxed)
        movementValid: securityMetrics.startTime === 0 || securityMetrics.totalDistance > 10,

        // Hesitation check (too many stops = human-like)
        hesitationValid: securityMetrics.hesitationCount <= 10,

        // Position accuracy
        positionValid,

        // Rotation validation (if applicable)
        rotationValid: puzzleState.rotation === 0 || Math.abs(position - puzzleState.targetX) <= tolerance * 1.5,
      };

      // Calculate security score (0-1, higher is more suspicious)
      const failedChecks = Object.values(securityChecks).filter(check => !check).length;
      const securityScore = failedChecks / Object.keys(securityChecks).length;

      // Enhanced validation logic - prioritize position accuracy
      const isValid = positionValid && (securityMetrics.startTime === 0 || securityScore < 0.6);

      console.log('Validation:', { position, targetX: puzzleState.targetX, tolerance, positionValid, securityChecks, securityScore, isValid });

      setIsValidated(isValid);

      if (isValid) {
        // Success - keep piece in position and call parent validation
        onValidate?.(true, position);

        // Reset security metrics for next attempt
        setSecurityMetrics({
          startTime: 0,
          endTime: 0,
          mouseMovements: [],
          totalDistance: 0,
          averageSpeed: 0,
          hesitationCount: 0,
        });

        // Show success animation if enabled
        if (showSuccessAnimation) {
          setShowSuccess(true);

          // Hide success animation after 5 seconds (increased from 3)
          setTimeout(() => {
            setShowSuccess(false);
          }, 5000);
        }

        // Trigger confetti if enabled
        if (showConfetti) {
          const defaultOptions = {
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
            gravity: 1,
            scalar: 1,
            duration: 3000,
          };

          const finalOptions = { ...defaultOptions, ...confettiOptions };
          triggerConfetti(finalOptions);
        }
      } else {
        // Failed attempt - show failed state
        setShowFailedAttempt(true);

        // Reset failed state after animation
        setTimeout(() => {
          setShowFailedAttempt(false);
          // Don't reset position - let user try again from current position
          // setPuzzleState((prev) => ({
          //   ...prev,
          //   sliderPosition: prev.targetX,
          // }));
        }, 800);

        // Call parent validation with failure
        onValidate?.(false, position);
      }

      return isValid;
    },
    [
      puzzleState.targetX,
      puzzleState.rotation,
      puzzleState.sliderPosition,
      tolerance,
      onValidate,
      showSuccessAnimation,
      showConfetti,
      confettiOptions,
      securityMetrics,
    ]
  );

  // Handle pointer events with improved UX and security tracking
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || isValidated) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if click is on the puzzle piece area
      const pieceX = puzzleState.sliderPosition;
      const pieceY = puzzleState.targetY;

      // More generous click area for better UX
      if (
        x >= pieceX - 5 &&
        x <= pieceX + pieceSize + 5 &&
        y >= pieceY - 5 &&
        y <= pieceY + pieceSize + 5
      ) {
        // Start security tracking with proper initialization
        const currentTime = Date.now();
        setSecurityMetrics({
          startTime: currentTime,
          endTime: 0,
          mouseMovements: [{ x: e.clientX, y: e.clientY, time: currentTime }],
          totalDistance: 0,
          averageSpeed: 0,
          hesitationCount: 0,
        });

        // Calculate offset from piece center for smooth dragging
        const offsetX = x - pieceX;
        setDragOffset(offsetX);
        setPuzzleState((prev) => ({ ...prev, isDragging: true }));
        e.preventDefault();
      }
    },
    [
      disabled,
      isValidated,
      puzzleState.sliderPosition,
      puzzleState.targetY,
      pieceSize,
      setDragOffset,
    ]
  );

  // Enhanced track interaction
  const handleTrackPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || isValidated) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;

      // Convert track position to puzzle piece position
      const trackPosition = Math.max(0, Math.min(x, rect.width));
      const newPosition = Math.max(
        0,
        Math.min(
          (trackPosition / rect.width) * (width - pieceSize),
          width - pieceSize
        )
      );

      // Initialize security metrics for track-based dragging
      const currentTime = Date.now();
      setSecurityMetrics({
        startTime: currentTime,
        endTime: 0,
        mouseMovements: [{ x: e.clientX, y: e.clientY, time: currentTime }],
        totalDistance: 0,
        averageSpeed: 0,
        hesitationCount: 0,
      });

      // Reset drag offset for track-based dragging
      setDragOffset(0);
      setPuzzleState((prev) => ({
        ...prev,
        sliderPosition: newPosition,
        isDragging: true,
      }));
      onPositionChange?.(newPosition);
      e.preventDefault();
    },
    [disabled, isValidated, pieceSize, width, onPositionChange, setDragOffset]
  );

  // Enhanced global pointer handling with security tracking
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!puzzleState.isDragging || disabled) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;

      // Use consistent position calculation with drag offset for smooth dragging
      const newPosition = Math.max(
        0,
        Math.min(x - dragOffset, width - pieceSize)
      );

      // Update security metrics
      setSecurityMetrics(prev => {
        const currentTime = Date.now();
        const lastMovement = prev.mouseMovements[prev.mouseMovements.length - 1];
        const timeDiff = lastMovement ? currentTime - lastMovement.time : 0;
        const distance = lastMovement ? Math.sqrt(
          Math.pow(e.clientX - lastMovement.x, 2) + Math.pow(e.clientY - lastMovement.y, 2)
        ) : 0;

        // Detect hesitation (very slow movement)
        const isHesitation = timeDiff > 200 && distance < 5;

        return {
          ...prev,
          mouseMovements: [...prev.mouseMovements, { x: e.clientX, y: e.clientY, time: currentTime }],
          totalDistance: prev.totalDistance + distance,
          averageSpeed: (prev.totalDistance + distance) / (currentTime - prev.startTime) * 1000,
          hesitationCount: prev.hesitationCount + (isHesitation ? 1 : 0),
        };
      });

      setPuzzleState((prev) => ({ ...prev, sliderPosition: newPosition }));
      onPositionChange?.(newPosition);
      e.preventDefault();
    };

    const handleGlobalPointerUp = () => {
      if (puzzleState.isDragging) {
        setPuzzleState((prev) => ({ ...prev, isDragging: false }));
        setDragOffset(0); // Reset drag offset
        validatePosition(puzzleState.sliderPosition);
      }
    };

    if (puzzleState.isDragging) {
      document.addEventListener("pointermove", handleGlobalPointerMove);
      document.addEventListener("pointerup", handleGlobalPointerUp);
    }

    return () => {
      document.removeEventListener("pointermove", handleGlobalPointerMove);
      document.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [
    puzzleState.isDragging,
    puzzleState.sliderPosition,
    disabled,
    pieceSize,
    width,
    onPositionChange,
    validatePosition,
    dragOffset,
  ]);

  // Handle validation state changes
  useEffect(() => {
    if (isValidated) {
      // Clear failed attempt state when successfully validated
      setShowFailedAttempt(false);
      setDragOffset(0);
    }
  }, [isValidated]);

  // Initialize on mount and ensure proper state reset
  useEffect(() => {
    // Reset all states when component mounts/remounts
    setIsValidated(false);
    setShowFailedAttempt(false);
    setDragOffset(0);
    setShowSuccess(false);

    // Initialize the puzzle
    initializePuzzle();
  }, []); // Only run on mount

  // Reinitialize when dimensions change significantly (but not on initial mount)
  const prevDimensionsRef = useRef({ width: 0, height: 0 });
  useEffect(() => {
    const prevWidth = prevDimensionsRef.current.width;
    const prevHeight = prevDimensionsRef.current.height;

    // Only reinitialize if dimensions actually changed and puzzle is already initialized
    if (prevWidth > 0 && prevHeight > 0 &&
      (Math.abs(width - prevWidth) > 10 || Math.abs(height - prevHeight) > 10)) {
      initializePuzzle();
    }

    prevDimensionsRef.current = { width, height };
  }, [width, height]);

  // Redraw when puzzle state changes (not on every function recreation)
  useEffect(() => {
    drawBackground();
    drawSliderPiece();
  }, [
    puzzleState.backgroundImage,
    puzzleState.targetX,
    puzzleState.targetY,
    puzzleState.sliderPosition,
    puzzleState.isDragging,
    isValidated,
    width,
    height,
  ]);

  const progressPercentage =
    (puzzleState.sliderPosition / (width - pieceSize)) * 100;

  return (
    <div
      className="slider-captcha-container w-full"
      role="region"
      aria-label="Slider CAPTCHA verification"
      aria-describedby="captcha-instructions"
    >
      {/* Hidden instructions for screen readers */}
      <div id="captcha-instructions" className="sr-only">
        Interactive puzzle verification. Drag the puzzle piece to complete the image. Current status: {isValidated ? 'Verified' : puzzleState.isDragging ? 'Dragging piece' : 'Ready to verify'}
      </div>

      {/* Main puzzle area */}
      <motion.div
        ref={containerRef}
        className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 w-full ${isValidated
          ? "border-green-400 shadow-green-200/50 shadow-lg"
          : showFailedAttempt
            ? "border-red-400 shadow-red-200/50 shadow-lg"
            : puzzleState.isDragging
              ? "border-blue-400 shadow-blue-200/50 shadow-lg"
              : darkMode
                ? "border-gray-600 hover:border-gray-500"
                : "border-gray-300 hover:border-gray-400"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        style={{ height }}
        onPointerDown={handlePointerDown}
        onKeyDown={(e) => {
          if (disabled || isValidated) return;

          // Keyboard navigation support
          const step = 10;
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const newPosition = Math.max(0, puzzleState.sliderPosition - step);
            setPuzzleState(prev => ({ ...prev, sliderPosition: newPosition }));
            onPositionChange?.(newPosition);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            const newPosition = Math.min(width - pieceSize, puzzleState.sliderPosition + step);
            setPuzzleState(prev => ({ ...prev, sliderPosition: newPosition }));
            onPositionChange?.(newPosition);
          } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            validatePosition(puzzleState.sliderPosition);
          }
        }}
        tabIndex={disabled ? -1 : 0}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={width - pieceSize}
        aria-valuenow={puzzleState.sliderPosition}
        aria-label={`Puzzle piece position: ${Math.round((puzzleState.sliderPosition / (width - pieceSize)) * 100)}% complete`}
        animate={{
          scale: puzzleState.isDragging ? 1.01 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Background canvas */}
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="absolute inset-0 w-full h-full"
        />

        {/* Slider piece canvas */}
        <canvas
          ref={sliderCanvasRef}
          width={width}
          height={height}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Loading overlay */}
        <AnimatePresence>
          {isLoadingImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${darkMode ? "bg-gray-900/80" : "bg-white/80"
                }`}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`px-6 py-4 rounded-xl font-medium shadow-lg ${darkMode
                  ? "bg-gray-800 text-gray-200 border border-gray-600"
                  : "bg-white text-gray-700 border border-gray-200"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <span>Loading puzzle image...</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced slider track */}
      <div className="mt-4">
        <div
          ref={sliderTrackRef}
          className={`relative h-10 rounded-xl border-2 transition-all duration-300 overflow-hidden ${isValidated
            ? "border-green-400 bg-green-50"
            : showFailedAttempt
              ? "border-red-400 bg-red-50"
              : puzzleState.isDragging
                ? "border-blue-400 bg-blue-50"
                : darkMode
                  ? "border-gray-600 bg-gray-700"
                  : "border-gray-300 bg-gray-100"
            }`}
          onPointerDown={handleTrackPointerDown}
          role="slider"
          aria-label="Verification progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressPercentage)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (disabled || isValidated) return;

            const step = 5;
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              const newPercentage = Math.max(0, progressPercentage - step);
              const newPosition = (newPercentage / 100) * (width - pieceSize);
              setPuzzleState(prev => ({ ...prev, sliderPosition: newPosition }));
              onPositionChange?.(newPosition);
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              const newPercentage = Math.min(100, progressPercentage + step);
              const newPosition = (newPercentage / 100) * (width - pieceSize);
              setPuzzleState(prev => ({ ...prev, sliderPosition: newPosition }));
              onPositionChange?.(newPosition);
            } else if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              validatePosition(puzzleState.sliderPosition);
            }
          }}
        >
          {/* Progress fill */}
          <motion.div
            className={`absolute left-0 top-0 bottom-0 rounded-lg transition-colors duration-300 ${isValidated
              ? "bg-green-200"
              : showFailedAttempt
                ? "bg-red-200"
                : puzzleState.isDragging
                  ? "bg-blue-200"
                  : darkMode
                    ? "bg-gray-600"
                    : "bg-gray-200"
              }`}
            style={{ width: `${progressPercentage}%` }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {/* Slider handle */}
          <motion.div
            className={`absolute top-0.5 bottom-0.5 w-12 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center ${isValidated
              ? "bg-green-500 border-green-600 text-white"
              : showFailedAttempt
                ? "bg-red-500 border-red-600 text-white"
                : puzzleState.isDragging
                  ? "bg-blue-500 border-blue-600 text-white cursor-grabbing"
                  : darkMode
                    ? "bg-gray-500 border-gray-400 text-white cursor-grab"
                    : "bg-white border-gray-400 text-gray-600 cursor-grab"
              } ${disabled ? "cursor-not-allowed" : ""}`}
            style={{
              left: `${(puzzleState.sliderPosition / (width - pieceSize)) * (100 - 12)
                }%`,
            }}
            animate={{
              scale: puzzleState.isDragging ? 1.05 : 1,
              boxShadow: puzzleState.isDragging
                ? "0 8px 25px rgba(0,0,0,0.2)"
                : "0 2px 10px rgba(0,0,0,0.1)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {isValidated ? (
              <Check className="w-4 h-4" />
            ) : (
              <div className="flex gap-0.5">
                <div className="w-0.5 h-3 bg-current opacity-50 rounded-full" />
                <div className="w-0.5 h-3 bg-current opacity-75 rounded-full" />
                <div className="w-0.5 h-3 bg-current rounded-full" />
              </div>
            )}
          </motion.div>

          {/* Track indicators */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className={`text-xs font-medium transition-opacity duration-200 ${isValidated || progressPercentage > 30 || puzzleState.isDragging
                ? "opacity-0"
                : darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
                }`}
            >
              Slide to verify →
            </span>
          </div>
        </div>
      </div>

      {/* Security Status Indicator */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className={`w-4 h-4 ${isValidated ? 'text-green-500' : puzzleState.isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {isValidated ? 'Verified' : puzzleState.isDragging ? 'Verifying...' : 'Security Check'}
          </span>
          {/* Debug: Show distance from target */}
          {puzzleState.isDragging && (
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              (Distance: {Math.abs(puzzleState.sliderPosition - puzzleState.targetX).toFixed(0)}px, Need: ≤{tolerance}px)
            </span>
          )}
        </div>

        {/* Piece type indicator */}
        <div className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
          {puzzleState.pieceType} {puzzleState.rotation > 0 && `(${puzzleState.rotation}°)`}
        </div>
      </div>

      {/* Enhanced Success Animation */}
      <AnimatePresence>
        {showSuccess && showSuccessAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -20 }}
            className={`mt-4 p-4 rounded-xl border-2 shadow-lg ${darkMode
              ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/30"
              : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
              }`}
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: 0, scale: 0 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative"
              >
                <CheckCircle2
                  className={`w-6 h-6 ${darkMode ? "text-green-400" : "text-green-500"}`}
                />
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute inset-0 rounded-full bg-green-400/30"
                />
              </motion.div>
              <div className="flex-1">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`font-semibold text-sm ${darkMode ? "text-green-400" : "text-green-700"}`}
                >
                  Verification Successful!
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`text-xs mt-1 ${darkMode ? "text-green-300/80" : "text-green-600/80"}`}
                >
                  Security check passed • Puzzle solved
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
