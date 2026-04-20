# Music3D

A music platform with a reactive 3D audio visualizer. A pulsing sphere, orbital particles, and a star field respond in real time to audio frequencies.

**Stack:** React · Three.js · Web Audio API · Node.js · Express · MongoDB (Docker)

---

## Requirements

- Node.js 18+
- Docker Desktop

---

## Getting Started

```bash
# 1. Install all dependencies (root, client and server)
npm install

# 2. Start MongoDB
npm run docker:up

# 3. Start client and server
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:4000

---

## Environment Variables

Copy `.env.example` to `packages/server/.env` and adjust if needed:

```bash
cp packages/server/.env.example packages/server/.env
```

---

## Usage

1. Register or log in
2. Create a playlist from the sidebar
3. Add a track using a direct mp3 URL
4. Click play — the 3D visualizer reacts to the audio in real time

### Sample audio URLs for testing

The following are free, publicly available mp3 files ready to use:

```
https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3
https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3
https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3
```

Paste any of these into the **Audio URL** field when adding a track.

> External audio URLs are routed through the server proxy (`/api/audio/proxy`) to avoid CORS issues.

---

## Project Structure

```
Music3D/
├── docker-compose.yml
├── packages/
│   ├── client/                 # React + Three.js
│   │   └── src/
│   │       ├── components/     # Visualizer3D, Player, FrequencyBars
│   │       ├── hooks/          # useAudioAnalyzer
│   │       ├── pages/          # Auth, Home
│   │       ├── store/          # Zustand (auth + player)
│   │       └── api/            # Axios client
│   └── server/                 # Express + Mongoose
│       └── src/
│           ├── models/         # User, Playlist
│           ├── routes/         # auth, playlists, audio proxy
│           └── middleware/     # JWT auth
└── package.json
```

---

## License

MIT License — Copyright (c) 2026 Carlos Mario Piedrahita Arango

See [LICENSE](./LICENSE) for full details.
