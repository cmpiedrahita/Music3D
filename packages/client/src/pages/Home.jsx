import { useEffect, useState } from 'react';
import { playlistAPI } from '../api';
import { usePlayerStore, useAuthStore } from '../store';
import Player from '../components/Player';
import styles from './Home.module.css';

export default function Home() {
  const [playlists, setPlaylists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newName, setNewName] = useState('');
  const [newTrack, setNewTrack] = useState({ title: '', artist: '', audioUrl: '', coverUrl: '' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const { setTrack } = usePlayerStore();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    playlistAPI.getAll().then((r) => setPlaylists(r.data));
  }, []);

  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const { data } = await playlistAPI.create({ name: newName });
    setPlaylists([...playlists, data]);
    setNewName('');
  };

  const addTrack = async (e) => {
    e.preventDefault();
    if (!selected) return;
    const { data } = await playlistAPI.addTrack(selected._id, newTrack);
    setPlaylists(playlists.map((p) => (p._id === data._id ? data : p)));
    setSelected(data);
    setNewTrack({ title: '', artist: '', audioUrl: '', coverUrl: '' });
  };

  const removeTrack = async (trackId) => {
    const { data } = await playlistAPI.removeTrack(selected._id, trackId);
    setPlaylists(playlists.map((p) => (p._id === data._id ? data : p)));
    setSelected(data);
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? '' : styles.sidebarHidden}`}>
        <div className={styles.sidebarHeader}>
          <span className={styles.logo}>Music3D</span>
          <button onClick={logout} className={styles.logoutBtn}>Exit</button>
        </div>

        <form onSubmit={createPlaylist} className={styles.newPlaylist}>
          <input
            placeholder="New playlist..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button type="submit">+</button>
        </form>

        <ul className={styles.playlistList}>
          {playlists.map((p) => (
            <li
              key={p._id}
              className={selected?._id === p._id ? styles.active : ''}
              onClick={() => { setSelected(p); setPanelOpen(true); }}
            >
              {p.name}
              <span className={styles.trackCount}>{p.tracks.length}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Toggle sidebar button */}
      <button className={styles.sidebarToggle} onClick={() => setSidebarOpen((v) => !v)}>
        {sidebarOpen ? '«' : '»'}
      </button>

      {/* Main */}
      <main className={styles.main}>
        <Player />

        {selected && panelOpen && (
          <div className={styles.playlistPanel}>
            <div className={styles.playlistPanelHeader}>
              <h2 className={styles.playlistName}>{selected.name}</h2>
              <button className={styles.panelToggle} onClick={() => setPanelOpen(false)}>
                ✕
              </button>
            </div>

            {/* Add track form */}
            <form onSubmit={addTrack} className={styles.addTrack}>
              <input placeholder="Title" value={newTrack.title} onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })} required />
              <input placeholder="Artist" value={newTrack.artist} onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })} />
              <input placeholder="Audio URL" value={newTrack.audioUrl} onChange={(e) => setNewTrack({ ...newTrack, audioUrl: e.target.value })} required />
              <input placeholder="Cover URL (optional)" value={newTrack.coverUrl} onChange={(e) => setNewTrack({ ...newTrack, coverUrl: e.target.value })} />
              <button type="submit">Add track</button>
            </form>

            {/* Track list */}
            <ul className={styles.trackList}>
              {selected.tracks.map((track, i) => (
                <li key={track._id} className={styles.trackItem}>
                  <button
                    className={styles.playTrack}
                    onClick={() => setTrack(track, selected.tracks, i)}
                  >
                    {track.title} — <span>{track.artist}</span>
                  </button>
                  <button className={styles.removeTrack} onClick={() => removeTrack(track._id)}>✕</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
