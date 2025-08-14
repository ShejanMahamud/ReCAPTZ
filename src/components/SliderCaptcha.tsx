import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SliderCaptchaConfig } from "../types";

// Pexels API configuration
const PEXELS_API_KEY =
  "w8hqhT3wZxwABO6SyD0Vjhvq8BjfkST7k52athhdqsDcefxdPapFyS5m"; // Free API key
const PEXELS_API_URL = "https://api.pexels.com/v1/search";

interface PexelsPhoto {
  id: number;
  src: {
    medium: string;
    small: string;
    large: string;
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
}

interface PuzzleState {
  targetX: number;
  targetY: number;
  sliderPosition: number;
  isDragging: boolean;
  backgroundImage: string;
  puzzlePath: Path2D;
}

export const SliderCaptcha: React.FC<SliderCaptchaProps> = ({
  width: propWidth,
  height = 180,
  config = {},
  darkMode = false,
  onValidate,
  onPositionChange,
  disabled = false,
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
    tolerance: baseTolerance = 12,
    backgroundImage,
    backgroundImages,
    enableShadow = true,
    shapeVariant = "traditional",
    difficulty = "medium",
    // TODO: Implement different interaction modes (click, swipe, keyboard)
    interactionMode = "drag",
    // TODO: Implement multi-piece puzzle mode
    multiPiece = false,
    pieceCount = 1,
    // TODO: Implement piece rotation functionality
    enableRotation = false,
    // TODO: Implement piece scaling functionality
    enableScaling = false,
    animationSpeed = "normal",
    theme = "default",
  } = config;

  // Adjust tolerance based on difficulty
  const tolerance = (() => {
    switch (difficulty) {
      case "easy":
        return baseTolerance * 1.5;
      case "medium":
        return baseTolerance;
      case "hard":
        return baseTolerance * 0.7;
      case "expert":
        return baseTolerance * 0.4;
      default:
        return baseTolerance;
    }
  })();

  // Get animation duration based on speed
  const getAnimationDuration = () => {
    switch (animationSpeed) {
      case "slow":
        return 800;
      case "fast":
        return 200;
      case "normal":
      default:
        return 500;
    }
  };

  const [puzzleState, setPuzzleState] = useState<PuzzleState>({
    targetX: 0,
    targetY: 0,
    sliderPosition: 0,
    isDragging: false,
    backgroundImage: "",
    puzzlePath: new Path2D(),
  });

  const [isValidated, setIsValidated] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [showFailedAttempt, setShowFailedAttempt] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  // Cache for loaded images to prevent duplicate loading
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const currentImageUrl = useRef<string>("");
  const attemptsRef = useRef<number>(0);

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

      // Add subtle noise for texture
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 10;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }
      ctx.putImageData(imageData, 0, 0);
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
    } catch (error) {
      console.warn("Failed to fetch Pexels image:", error);
      return "";
    } finally {
      setIsLoadingImage(false);
    }
  }, []);

  // Create traditional puzzle piece shape
  const createTraditionalPuzzlePath = useCallback(
    (x: number, y: number): Path2D => {
      const path = new Path2D();
      const size = pieceSize;

      // Traditional puzzle piece parameters
      const tabSize = size * 0.2; // Size of the tabs/blanks
      const tabRadius = tabSize * 0.8; // Roundness of tabs

      // Randomly decide which edges have tabs (outward) vs blanks (inward)
      const hasTopTab = Math.random() > 0.5;
      const hasRightTab = Math.random() > 0.5;
      const hasBottomTab = Math.random() > 0.5;
      const hasLeftTab = Math.random() > 0.5;

      path.moveTo(x, y);

      // Top edge
      if (hasTopTab) {
        // Draw tab on top edge
        path.lineTo(x + size * 0.35, y);
        path.arc(x + size * 0.5, y - tabRadius, tabRadius, Math.PI, 0, false);
        path.lineTo(x + size, y);
      } else {
        // Draw blank on top edge
        path.lineTo(x + size * 0.35, y);
        path.arc(x + size * 0.5, y + tabRadius, tabRadius, Math.PI, 0, true);
        path.lineTo(x + size, y);
      }

      // Right edge
      if (hasRightTab) {
        // Draw tab on right edge
        path.lineTo(x + size, y + size * 0.35);
        path.arc(
          x + size + tabRadius,
          y + size * 0.5,
          tabRadius,
          -Math.PI / 2,
          Math.PI / 2,
          false
        );
        path.lineTo(x + size, y + size);
      } else {
        // Draw blank on right edge
        path.lineTo(x + size, y + size * 0.35);
        path.arc(
          x + size - tabRadius,
          y + size * 0.5,
          tabRadius,
          -Math.PI / 2,
          Math.PI / 2,
          true
        );
        path.lineTo(x + size, y + size);
      }

      // Bottom edge
      if (hasBottomTab) {
        // Draw tab on bottom edge
        path.lineTo(x + size * 0.65, y + size);
        path.arc(
          x + size * 0.5,
          y + size + tabRadius,
          tabRadius,
          0,
          Math.PI,
          false
        );
        path.lineTo(x, y + size);
      } else {
        // Draw blank on bottom edge
        path.lineTo(x + size * 0.65, y + size);
        path.arc(
          x + size * 0.5,
          y + size - tabRadius,
          tabRadius,
          0,
          Math.PI,
          true
        );
        path.lineTo(x, y + size);
      }

      // Left edge
      if (hasLeftTab) {
        // Draw tab on left edge
        path.lineTo(x, y + size * 0.65);
        path.arc(
          x - tabRadius,
          y + size * 0.5,
          tabRadius,
          Math.PI / 2,
          -Math.PI / 2,
          false
        );
        path.lineTo(x, y);
      } else {
        // Draw blank on left edge
        path.lineTo(x, y + size * 0.65);
        path.arc(
          x + tabRadius,
          y + size * 0.5,
          tabRadius,
          Math.PI / 2,
          -Math.PI / 2,
          true
        );
        path.lineTo(x, y);
      }

      path.closePath();
      return path;
    },
    [pieceSize]
  );

  // Create geometric puzzle piece shape
  const createGeometricPuzzlePath = useCallback(
    (x: number, y: number): Path2D => {
      const path = new Path2D();
      const size = pieceSize;

      // Geometric shapes: triangle, square, hexagon, octagon
      const shapes = ["triangle", "square", "hexagon", "octagon"];
      const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];

      switch (selectedShape) {
        case "triangle": {
          path.moveTo(x + size / 2, y);
          path.lineTo(x + size, y + size);
          path.lineTo(x, y + size);
          break;
        }

        case "square": {
          path.rect(x, y, size, size);
          break;
        }

        case "hexagon": {
          const centerX = x + size / 2;
          const centerY = y + size / 2;
          const radius = size / 2;
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const px = centerX + radius * Math.cos(angle);
            const py = centerY + radius * Math.sin(angle);
            if (i === 0) path.moveTo(px, py);
            else path.lineTo(px, py);
          }
          break;
        }

        case "octagon": {
          const octCenterX = x + size / 2;
          const octCenterY = y + size / 2;
          const octRadius = size / 2;
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const px = octCenterX + octRadius * Math.cos(angle);
            const py = octCenterY + octRadius * Math.sin(angle);
            if (i === 0) path.moveTo(px, py);
            else path.lineTo(px, py);
          }
          break;
        }
      }

      path.closePath();
      return path;
    },
    [pieceSize]
  );

  // Create organic puzzle piece shape
  const createOrganicPuzzlePath = useCallback(
    (x: number, y: number): Path2D => {
      const path = new Path2D();
      const size = pieceSize;

      // Organic blob-like shape
      const centerX = x + size / 2;
      const centerY = y + size / 2;
      const radius = size / 2;

      path.moveTo(centerX + radius, centerY);

      // Create organic curve with multiple control points
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const baseRadius = radius * (0.7 + Math.random() * 0.6);
        const px = centerX + baseRadius * Math.cos(angle);
        const py = centerY + baseRadius * Math.sin(angle);

        if (i === 0) {
          path.moveTo(px, py);
        } else {
          // Add some randomness for organic feel
          const cp1x = centerX + radius * 0.8 * Math.cos(angle - 0.2);
          const cp1y = centerY + radius * 0.8 * Math.sin(angle - 0.2);
          const cp2x = centerX + radius * 0.8 * Math.cos(angle + 0.2);
          const cp2y = centerY + radius * 0.8 * Math.sin(angle + 0.2);

          path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, px, py);
        }
      }

      path.closePath();
      return path;
    },
    [pieceSize]
  );

  // Create minimal puzzle piece shape
  const createMinimalPuzzlePath = useCallback(
    (x: number, y: number): Path2D => {
      const path = new Path2D();
      const size = pieceSize;

      // Simple rounded rectangle
      const cornerRadius = size * 0.1;

      path.moveTo(x + cornerRadius, y);
      path.lineTo(x + size - cornerRadius, y);
      path.arc(
        x + size - cornerRadius,
        y + cornerRadius,
        cornerRadius,
        -Math.PI / 2,
        0,
        false
      );
      path.lineTo(x + size, y + size - cornerRadius);
      path.arc(
        x + size - cornerRadius,
        y + size - cornerRadius,
        cornerRadius,
        0,
        Math.PI / 2,
        false
      );
      path.lineTo(x + cornerRadius, y + size);
      path.arc(
        x + cornerRadius,
        y + size - cornerRadius,
        cornerRadius,
        Math.PI / 2,
        Math.PI,
        false
      );
      path.lineTo(x, y + cornerRadius);
      path.arc(
        x + cornerRadius,
        y + cornerRadius,
        cornerRadius,
        Math.PI,
        -Math.PI / 2,
        false
      );

      path.closePath();
      return path;
    },
    [pieceSize]
  );

  // Create complex puzzle piece shape
  const createComplexPuzzlePath = useCallback(
    (x: number, y: number): Path2D => {
      const path = new Path2D();
      const size = pieceSize;

      // Complex shape with multiple curves and details
      const centerX = x + size / 2;
      const centerY = y + size / 2;

      // Start with a star-like shape
      const points = 5;
      const outerRadius = size / 2;
      const innerRadius = size / 4;

      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const px = centerX + radius * Math.cos(angle);
        const py = centerY + radius * Math.sin(angle);

        if (i === 0) {
          path.moveTo(px, py);
        } else {
          // Add curved connections
          const prevAngle = ((i - 1) * Math.PI) / points;
          const prevRadius = (i - 1) % 2 === 0 ? outerRadius : innerRadius;
          const prevX = centerX + prevRadius * Math.cos(prevAngle);
          const prevY = centerY + prevRadius * Math.sin(prevAngle);

          const cp1x = prevX + (px - prevX) * 0.3;
          const cp1y = prevY + (py - prevY) * 0.3;
          const cp2x = px - (px - prevX) * 0.3;
          const cp2y = py - (py - prevY) * 0.3;

          path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, px, py);
        }
      }

      path.closePath();
      return path;
    },
    [pieceSize]
  );

  // Main puzzle path creation function that selects variant
  const createPuzzlePath = useCallback(
    (x: number, y: number): Path2D => {
      switch (shapeVariant) {
        case "geometric":
          return createGeometricPuzzlePath(x, y);
        case "organic":
          return createOrganicPuzzlePath(x, y);
        case "minimal":
          return createMinimalPuzzlePath(x, y);
        case "complex":
          return createComplexPuzzlePath(x, y);
        case "traditional":
        default:
          return createTraditionalPuzzlePath(x, y);
      }
    },
    [
      shapeVariant,
      createTraditionalPuzzlePath,
      createGeometricPuzzlePath,
      createOrganicPuzzlePath,
      createMinimalPuzzlePath,
      createComplexPuzzlePath,
    ]
  );

  // Initialize puzzle
  const initializePuzzle = useCallback(async () => {
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

    const puzzlePath = createPuzzlePath(targetX, targetY);

    // Clear image cache and current URL when initializing new puzzle
    imageCache.current.clear();
    currentImageUrl.current = "";
    attemptsRef.current = 0;

    setPuzzleState({
      targetX,
      targetY,
      sliderPosition: 0,
      isDragging: false,
      backgroundImage: bgImage || "",
      puzzlePath,
    });

    // Reset all UI states
    setIsValidated(false);
    setShowFailedAttempt(false);
    setDragOffset(0);
  }, [
    width,
    height,
    pieceSize,
    backgroundImage,
    backgroundImages,
    createPuzzlePath,
    fetchPexelsPhoto,
  ]);

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

      // Create hole with better shadow effect
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill(puzzleState.puzzlePath);

      // Fill hole with white background for better visibility
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "white";
      ctx.fill(puzzleState.puzzlePath);

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
        ctx.stroke(puzzleState.puzzlePath);
      }

      // Main border
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
      ctx.lineWidth = 2;
      ctx.stroke(puzzleState.puzzlePath);

      // Inner highlight
      ctx.strokeStyle = darkMode
        ? "rgba(255,255,255,0.1)"
        : "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke(puzzleState.puzzlePath);

      ctx.restore();
    },
    [puzzleState.puzzlePath, darkMode, enableShadow]
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

    // Use the stored puzzle path translated to current position
    const deltaX = pieceX - puzzleState.targetX;
    const deltaY = 0; // Y position doesn't change

    const piecePath = new Path2D();
    const transform = new DOMMatrix();
    transform.translateSelf(deltaX, deltaY);
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

  // Enhanced validation
  const validatePosition = useCallback(
    (position: number) => {
      const isValid = Math.abs(position - puzzleState.targetX) <= tolerance;
      console.log(
        `Validation: position=${position}, target=${puzzleState.targetX}, isValid=${isValid}, attempts=${attemptsRef.current}`
      );

      setIsValidated(isValid);

      if (isValid) {
        // Success - keep piece in position and call parent validation
        console.log("Slider CAPTCHA: SUCCESS");
        onValidate?.(true, position);
      } else {
        // Failed attempt - increment attempts and show failed state
        attemptsRef.current += 1;
        console.log(`Slider CAPTCHA failed attempt ${attemptsRef.current}`);

        setShowFailedAttempt(true);

        // Reset failed state after animation
        setTimeout(() => {
          setShowFailedAttempt(false);
          setPuzzleState((prev) => ({
            ...prev,
            sliderPosition: 0,
          }));
        }, getAnimationDuration());

        // Call parent validation with failure
        onValidate?.(false, position);
      }

      return isValid;
    },
    [puzzleState.targetX, tolerance, onValidate, getAnimationDuration]
  );

  // Handle pointer events with improved UX
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
        // Calculate offset from piece center for smooth dragging
        const offsetX = x - (pieceX + pieceSize / 2);
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

      // Use the same calculation as canvas dragging for consistency
      const trackPosition = Math.max(0, Math.min(x, rect.width));
      const newPosition = Math.max(
        0,
        Math.min(
          (trackPosition / rect.width) * (width - pieceSize),
          width - pieceSize
        )
      );

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

  // Enhanced global pointer handling
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!puzzleState.isDragging || disabled) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;

      // Use consistent position calculation with drag offset for smooth dragging
      const newPosition = Math.max(
        0,
        Math.min(x - pieceSize / 2 - dragOffset, width - pieceSize)
      );

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
    attemptsRef.current = 0;

    // Initialize the puzzle
    initializePuzzle();
  }, [initializePuzzle]);

  // Reinitialize when dimensions change
  useEffect(() => {
    if (width && height) {
      initializePuzzle();
    }
  }, [width, height, initializePuzzle]);

  // Redraw when state changes
  useEffect(() => {
    drawBackground();
  }, [drawBackground]);

  useEffect(() => {
    drawSliderPiece();
  }, [drawSliderPiece]);

  const progressPercentage =
    (puzzleState.sliderPosition / (width - pieceSize)) * 100;

  // Get theme-based styling
  const getThemeStyles = () => {
    switch (theme) {
      case "neon":
        return {
          borderColor: "border-cyan-400",
          shadowColor: "shadow-cyan-400/50",
          bgColor: "bg-cyan-500",
          textColor: "text-cyan-100",
        };
      case "pastel":
        return {
          borderColor: "border-pink-300",
          shadowColor: "shadow-pink-200/50",
          bgColor: "bg-pink-200",
          textColor: "text-pink-700",
        };
      case "monochrome":
        return {
          borderColor: "border-gray-600",
          shadowColor: "shadow-gray-500/50",
          bgColor: "bg-gray-600",
          textColor: "text-gray-100",
        };
      case "gradient":
        return {
          borderColor: "border-gradient-to-r from-blue-500 to-purple-500",
          shadowColor: "shadow-blue-400/50",
          bgColor: "bg-gradient-to-r from-blue-500 to-purple-500",
          textColor: "text-white",
        };
      default:
        return {
          borderColor: "border-gray-300",
          shadowColor: "shadow-gray-200/50",
          bgColor: "bg-blue-500",
          textColor: "text-white",
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="slider-captcha-container w-full">
      {/* Main puzzle area */}
      <motion.div
        ref={containerRef}
        className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 w-full ${
          isValidated
            ? "border-green-400 shadow-green-200/50 shadow-lg"
            : showFailedAttempt
            ? "border-red-400 shadow-red-200/50 shadow-lg"
            : puzzleState.isDragging
            ? `${themeStyles.borderColor} ${themeStyles.shadowColor} shadow-lg`
            : darkMode
            ? "border-gray-600 hover:border-gray-500"
            : `${
                themeStyles.borderColor
              } hover:${themeStyles.borderColor.replace(
                "border-",
                "border-opacity-80 "
              )}`
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        style={{ height }}
        onPointerDown={handlePointerDown}
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
              className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${
                darkMode ? "bg-gray-900/80" : "bg-white/80"
              }`}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`px-6 py-4 rounded-xl font-medium shadow-lg ${
                  darkMode
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
          className={`relative h-10 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
            isValidated
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
        >
          {/* Progress fill */}
          <motion.div
            className={`absolute left-0 top-0 bottom-0 rounded-lg transition-colors duration-300 ${
              isValidated
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
            className={`absolute top-0.5 bottom-0.5 w-12 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center ${
              isValidated
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
              left: `${
                (puzzleState.sliderPosition / (width - pieceSize)) * (100 - 12)
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
              className={`text-xs font-medium transition-opacity duration-200 ${
                isValidated || progressPercentage > 30 || puzzleState.isDragging
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
    </div>
  );
};
