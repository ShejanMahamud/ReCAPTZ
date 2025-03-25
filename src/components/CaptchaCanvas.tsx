import React, { useEffect, useRef } from 'react';
import { useCaptcha } from '../context/CaptchaContext';

interface CaptchaCanvasProps {
  width?: number;
  height?: number;
  noiseLevel?: number;
  darkMode?: boolean;
}

export const CaptchaCanvas: React.FC<CaptchaCanvasProps> = ({
  width = 280,
  height = 60,
  noiseLevel = 30,
  darkMode = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { captchaText } = useCaptcha();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    if (darkMode) {
      bgGradient.addColorStop(0, '#111827');
      bgGradient.addColorStop(0.5, '#1F2937');
      bgGradient.addColorStop(1, '#111827');
    } else {
      bgGradient.addColorStop(0, '#ffffff');
      bgGradient.addColorStop(0.5, '#f8fafc');
      bgGradient.addColorStop(1, '#ffffff');
    }
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Add modern hexagonal pattern
    const hexSize = 12;
    const hexHeight = hexSize * Math.sqrt(3);
    ctx.strokeStyle = darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
    ctx.lineWidth = 1;

    for (let row = 0; row < height / hexHeight + 1; row++) {
      for (let col = 0; col < width / (hexSize * 3) + 1; col++) {
        const x = col * hexSize * 3 + (row % 2) * hexSize * 1.5;
        const y = row * hexHeight;
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = i * Math.PI / 3;
          const xPos = x + hexSize * Math.cos(angle);
          const yPos = y + hexSize * Math.sin(angle);
          if (i === 0) ctx.moveTo(xPos, yPos);
          else ctx.lineTo(xPos, yPos);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    // Add dynamic noise patterns
    for (let i = 0; i < noiseLevel; i++) {
      const noiseType = Math.random();
      ctx.beginPath();

      if (noiseType < 0.3) {
        // Circular noise
        const gradient = ctx.createRadialGradient(
          Math.random() * width, Math.random() * height, 0,
          Math.random() * width, Math.random() * height, Math.random() * 15
        );
        gradient.addColorStop(0, darkMode 
          ? `hsla(${Math.random() * 360}, 70%, 75%, 0.1)`
          : `hsla(${Math.random() * 360}, 70%, 50%, 0.08)`
        );
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.arc(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 8 + 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (noiseType < 0.6) {
        // Curved lines
        ctx.strokeStyle = darkMode 
          ? `hsla(${Math.random() * 360}, 70%, 75%, 0.1)`
          : `hsla(${Math.random() * 360}, 70%, 50%, 0.08)`;
        ctx.lineWidth = Math.random() * 1.5 + 0.5;
        
        const startX = Math.random() * width;
        const startY = Math.random() * height;
        const controlX = Math.random() * width;
        const controlY = Math.random() * height;
        const endX = Math.random() * width;
        const endY = Math.random() * height;
        
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();
      } else {
        // Geometric shapes
        ctx.fillStyle = darkMode 
          ? `hsla(${Math.random() * 360}, 70%, 75%, 0.08)`
          : `hsla(${Math.random() * 360}, 70%, 50%, 0.06)`;
        
        const points = Math.floor(Math.random() * 3) + 3; // 3-5 sided shapes
        const centerX = Math.random() * width;
        const centerY = Math.random() * height;
        const radius = Math.random() * 6 + 2;
        
        ctx.beginPath();
        for (let j = 0; j < points; j++) {
          const angle = (j * 2 * Math.PI / points) + Math.random() * 0.2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw CAPTCHA text with enhanced effects
    const chars = captchaText.split('');
    const charWidth = width / (chars.length + 2);
    
    chars.forEach((char, i) => {
      const x = charWidth * (i + 1.5);
      const y = height / 2;
      const rotation = (Math.random() - 0.5) * 0.5;
      const fontSize = Math.floor(Math.random() * 12 + 28);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Random font style for each character
      const fontStyles = ['normal', 'italic'];
      const fontWeights = ['normal', 'bold'];
      const style = fontStyles[Math.floor(Math.random() * fontStyles.length)];
      const weight = fontWeights[Math.floor(Math.random() * fontWeights.length)];
      ctx.font = `${style} ${weight} ${fontSize}px 'SF Mono', Menlo, Monaco, Consolas, monospace`;
      
      // Create unique gradient for each character
      const charGradient = ctx.createLinearGradient(-15, -15, 15, 15);
      const hue = Math.random() * 360;
      if (darkMode) {
        charGradient.addColorStop(0, `hsla(${hue}, 80%, 75%, 1)`);
        charGradient.addColorStop(0.5, `hsla(${(hue + 30) % 360}, 80%, 70%, 1)`);
        charGradient.addColorStop(1, `hsla(${(hue + 60) % 360}, 80%, 65%, 1)`);
      } else {
        charGradient.addColorStop(0, `hsla(${hue}, 80%, 45%, 1)`);
        charGradient.addColorStop(0.5, `hsla(${(hue + 30) % 360}, 80%, 40%, 1)`);
        charGradient.addColorStop(1, `hsla(${(hue + 60) % 360}, 80%, 35%, 1)`);
      }
      
      // Enhanced text effects
      ctx.shadowColor = darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Add character outline
      ctx.strokeStyle = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw character with gradient fill and outline
      ctx.fillStyle = charGradient;
      ctx.fillText(char, 0, 0);
      ctx.strokeText(char, 0, 0);
      
      ctx.restore();
    });

    // Add decorative wave patterns
    const waveCount = 2;
    for (let w = 0; w < waveCount; w++) {
      ctx.beginPath();
      ctx.strokeStyle = darkMode 
        ? `rgba(255,255,255,${0.03 + w * 0.02})`
        : `rgba(0,0,0,${0.02 + w * 0.01})`;
      ctx.lineWidth = 1;
      
      const amplitude = 8 - w * 2;
      const frequency = 0.02 + w * 0.01;
      const offsetY = height / 2 + w * 10;
      
      ctx.moveTo(0, offsetY);
      for (let x = 0; x < width; x++) {
        const y = offsetY + Math.sin(x * frequency) * amplitude;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Add subtle shine effect
    const shine = ctx.createLinearGradient(0, 0, width, height);
    shine.addColorStop(0, 'rgba(255,255,255,0)');
    shine.addColorStop(0.5, darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)');
    shine.addColorStop(1, 'rgba(255,255,255,0)');
    
    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, width, height);

  }, [captchaText, width, height, noiseLevel, darkMode]);

  return (
    <div className={`relative overflow-hidden rounded-md ${
      darkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full"
      />
    </div>
  );
};