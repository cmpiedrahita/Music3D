import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:4000/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const playlistAPI = {
  getAll: () => api.get('/playlists'),
  create: (data) => api.post('/playlists', data),
  getById: (id) => api.get(`/playlists/${id}`),
  addTrack: (id, track) => api.post(`/playlists/${id}/tracks`, track),
  removeTrack: (id, trackId) => api.delete(`/playlists/${id}/tracks/${trackId}`),
  delete: (id) => api.delete(`/playlists/${id}`),
};

export default api;
