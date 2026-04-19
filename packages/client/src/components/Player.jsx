import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../store';
import { useAudioAnalyzer } from '../hooks/useAudioAnalyzer';
import Visualizer3D from './Visualizer3D';
import FrequencyBars from './FrequencyBars';
import styles from './Player.module.css';

export default function Player() {
  const { currentTrack, isPlaying, togglePlay, next, prev } = usePlayerStore();
  const audioRef = useRef(null);
  const audioData = useAudioAnalyzer(audioRef);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.audioUrl;
    audio.play().catch(() => {});
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.play().catch(() => {}) : audio.pause();
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio.duration) setProgress(audio.currentTime / audio.duration);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <div className={styles.wrapper}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onEnded={next}
        crossOrigin="anonymous"
      />

      {/* 3D Canvas */}
      <div className={styles.canvas}>
        <Visualizer3D audioData={audioData} />
      </div>

      {/* HUD overlay */}
      <div className={styles.hud}>
        {/* Track info */}
        <div className={styles.trackInfo}>
          {currentTrack?.coverUrl && (
            <img src={currentTrack.coverUrl} alt="cover" className={styles.cover} />
          )}
          <div>
            <p className={styles.title}>{currentTrack?.title || 'No track selected'}</p>
            <p className={styles.artist}>{currentTrack?.artist || '—'}</p>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button onClick={prev} className={styles.btn}>⏮</button>
          <button onClick={togglePlay} className={`${styles.btn} ${styles.playBtn}`}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={next} className={styles.btn}>⏭</button>
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrapper} onClick={handleSeek}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
          </div>
          <div className={styles.times}>
            <span>{fmt(audioRef.current?.currentTime || 0)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        {/* Frequency bars */}
        <div className={styles.freqBars}>
          <FrequencyBars frequencyData={audioData.frequencyData} />
        </div>
      </div>
    </div>
  );
}
