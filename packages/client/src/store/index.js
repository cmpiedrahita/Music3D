import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,

  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));

export const usePlayerStore = create((set) => ({
  currentTrack: null,
  playlist: [],
  isPlaying: false,
  currentIndex: 0,

  setTrack: (track, playlist = [], index = 0) =>
    set({ currentTrack: track, playlist, currentIndex: index, isPlaying: true }),

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  next: () =>
    set((s) => {
      const nextIndex = (s.currentIndex + 1) % s.playlist.length;
      return { currentIndex: nextIndex, currentTrack: s.playlist[nextIndex], isPlaying: true };
    }),

  prev: () =>
    set((s) => {
      const prevIndex = (s.currentIndex - 1 + s.playlist.length) % s.playlist.length;
      return { currentIndex: prevIndex, currentTrack: s.playlist[prevIndex], isPlaying: true };
    }),
}));
