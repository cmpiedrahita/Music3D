import { useEffect, useRef, useState } from 'react';

export function useAudioAnalyzer(audioRef) {
  const contextRef = useRef(null);
  const analyzerRef = useRef(null);
  const sourceRef = useRef(null);
  const [audioData, setAudioData] = useState({
    bass: 0,
    mid: 0,
    treble: 0,
    overall: 0,
    frequencyData: new Uint8Array(128),
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setup = () => {
      if (contextRef.current) return;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyzer = ctx.createAnalyser();
      analyzer.fftSize = 256;
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyzer);
      analyzer.connect(ctx.destination);
      contextRef.current = ctx;
      analyzerRef.current = analyzer;
      sourceRef.current = source;
    };

    audio.addEventListener('play', setup, { once: true });
    return () => audio.removeEventListener('play', setup);
  }, [audioRef]);

  useEffect(() => {
    let frameId;
    const analyze = () => {
      if (!analyzerRef.current) {
        frameId = requestAnimationFrame(analyze);
        return;
      }
      const analyzer = analyzerRef.current;
      const bufferLength = analyzer.frequencyBinCount;
      const data = new Uint8Array(bufferLength);
      analyzer.getByteFrequencyData(data);

      const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255;
      const mid = data.slice(10, 50).reduce((a, b) => a + b, 0) / 40 / 255;
      const treble = data.slice(50, 100).reduce((a, b) => a + b, 0) / 50 / 255;
      const overall = data.reduce((a, b) => a + b, 0) / bufferLength / 255;

      setAudioData({ bass, mid, treble, overall, frequencyData: data });
      frameId = requestAnimationFrame(analyze);
    };

    frameId = requestAnimationFrame(analyze);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return audioData;
}
