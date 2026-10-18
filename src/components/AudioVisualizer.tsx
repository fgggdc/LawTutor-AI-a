import React, { useEffect, useRef } from 'react';

export type VisualizerMode = 'orb' | 'bars' | 'wave' | 'ring';

interface AudioVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  mode?: VisualizerMode;
  audioLevel?: number; // 0 to 1
  size?: 'sm' | 'md' | 'lg';
  themeColor?: 'amber' | 'emerald' | 'blue' | 'purple';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isListening,
  isSpeaking,
  isProcessing,
  mode = 'orb',
  size = 'md',
  themeColor = 'amber'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const updateDimensions = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        width = canvas.width = Math.floor(rect.width);
        height = canvas.height = Math.floor(rect.height);
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener('resize', updateDimensions);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      phaseRef.current += 0.05;
      const phase = phaseRef.current;

      const stateMultiplier = isSpeaking ? 1.0 : isListening ? 0.8 : isProcessing ? 0.5 : 0.15;
      const centerX = width / 2;
      const centerY = height / 2;

      // Color scheme
      let primaryColor = 'rgba(217, 119, 6, '; // Amber-600
      let secondaryColor = 'rgba(245, 158, 11, '; // Amber-500
      let glowColor = 'rgba(251, 191, 36, '; // Amber-400

      if (isSpeaking) {
        primaryColor = 'rgba(16, 185, 129, '; // Emerald-500 (Teacher Speaking)
        secondaryColor = 'rgba(52, 211, 153, ';
        glowColor = 'rgba(110, 231, 183, ';
      } else if (isListening) {
        primaryColor = 'rgba(239, 68, 68, '; // Red-500 (Listening to Student)
        secondaryColor = 'rgba(248, 113, 113, ';
        glowColor = 'rgba(252, 165, 165, ';
      } else if (isProcessing) {
        primaryColor = 'rgba(99, 102, 241, '; // Indigo-500 (AI Thinking)
        secondaryColor = 'rgba(129, 140, 248, ';
        glowColor = 'rgba(165, 180, 252, ';
      }

      if (mode === 'orb') {
        // 2026 AI Neural Pulse Orb
        const baseRadius = size === 'lg' ? 65 : size === 'sm' ? 35 : 50;
        const pulse = Math.sin(phase * 2) * (10 * stateMultiplier);
        const radius = baseRadius + pulse;

        // Outer glow
        const glowGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          radius * 0.4,
          centerX,
          centerY,
          radius * 2.2
        );
        glowGrad.addColorStop(0, `${primaryColor}${0.6 * stateMultiplier})`);
        glowGrad.addColorStop(0.5, `${secondaryColor}${0.25 * stateMultiplier})`);
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Wave rings
        const ringCount = 3;
        for (let r = 0; r < ringCount; r++) {
          const ringRadius = radius + (r * 15 * stateMultiplier) + (Math.sin(phase * 3 + r) * 6);
          ctx.strokeStyle = `${glowColor}${0.4 / (r + 1)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(centerX, centerY, Math.max(10, ringRadius), 0, Math.PI * 2);
          ctx.stroke();
        }

        // Core Glowing Orb
        const coreGrad = ctx.createRadialGradient(
          centerX - radius * 0.3,
          centerY - radius * 0.3,
          2,
          centerX,
          centerY,
          radius
        );
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.3, `${glowColor}0.9)`);
        coreGrad.addColorStop(0.8, `${primaryColor}0.95)`);
        coreGrad.addColorStop(1, `${primaryColor}0.4)`);

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

      } else if (mode === 'bars') {
        // Cyber Law Equalizer Bars
        const barCount = 28;
        const barWidth = Math.max(3, (width - 60) / barCount - 3);
        const startX = (width - (barCount * (barWidth + 3))) / 2;

        for (let i = 0; i < barCount; i++) {
          const normI = i / barCount;
          const heightFactor = Math.sin(phase * 4 + normI * Math.PI * 3) * 0.5 + 0.5;
          const barHeight = Math.max(6, heightFactor * (height * 0.7) * stateMultiplier + 8);

          const x = startX + i * (barWidth + 3);
          const y = centerY - barHeight / 2;

          const grad = ctx.createLinearGradient(x, y, x, y + barHeight);
          grad.addColorStop(0, `${glowColor}0.95)`);
          grad.addColorStop(0.5, `${secondaryColor}0.8)`);
          grad.addColorStop(1, `${primaryColor}0.4)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 3);
          ctx.fill();
        }

      } else if (mode === 'wave') {
        // Dynamic Sound Sine Waves
        const waveCount = 3;
        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          ctx.strokeStyle = `${w === 0 ? primaryColor : secondaryColor}${0.7 - w * 0.2})`;
          ctx.lineWidth = 2.5 - w * 0.5;

          const freq = 0.02 + w * 0.008;
          const amp = (height * 0.3) * stateMultiplier * (1 - w * 0.2);

          for (let x = 0; x < width; x += 4) {
            const y = centerY + Math.sin(x * freq + phase * 3 + w * 1.5) * amp;
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }

      } else if (mode === 'ring') {
        // Minimalist Concentric Ring
        const ringRadius = Math.min(width, height) * 0.35;
        const segments = 60;

        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const waveVal = Math.sin(angle * 6 + phase * 4) * (14 * stateMultiplier);
          const r1 = ringRadius + waveVal;
          const r2 = ringRadius + waveVal + (12 * stateMultiplier) + 2;

          const x1 = centerX + Math.cos(angle) * r1;
          const y1 = centerY + Math.sin(angle) * r1;
          const x2 = centerX + Math.cos(angle) * r2;
          const y2 = centerY + Math.sin(angle) * r2;

          ctx.strokeStyle = `${primaryColor}${0.3 + (i % 2) * 0.5})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening, isSpeaking, isProcessing, mode, size, themeColor]);

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
