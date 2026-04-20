import { useEffect, useRef } from 'react';

export default function FrequencyBars({ frequencyData }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const bars = 64;
    const step = Math.floor(frequencyData.length / bars);
    const barWidth = width / bars - 1;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < bars; i++) {
      const value = frequencyData[i * step] / 255;
      const barHeight = value * height;
      const hue = 200 + value * 160; // blue → red
      ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.9)`;
      ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.8)`;
      ctx.shadowBlur = 6;
      ctx.fillRect(i * (barWidth + 1), height - barHeight, barWidth, barHeight);
    }
  }, [frequencyData]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={60}
      style={{ width: '100%', height: '60px', opacity: 0.85 }}
    />
  );
}
