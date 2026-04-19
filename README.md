# 🎵 Music3D

Plataforma de música con visualizador 3D reactivo al audio. Esfera pulsante, partículas orbitales y campo de estrellas que reaccionan en tiempo real a las frecuencias del audio.

**Stack:** React + Three.js + Web Audio API · Node.js/Express · MongoDB (Docker)

## Requisitos

- Node.js 18+
- Docker Desktop

## Instalación y arranque

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar MongoDB
npm run docker:up

# 3. Arrancar cliente y servidor en paralelo
npm run dev
```

- Cliente: http://localhost:5173
- API: http://localhost:4000

## Uso

1. Regístrate o inicia sesión
2. Crea una playlist desde el sidebar
3. Agrega tracks con URL de audio externo (mp3 directo)
4. Haz click en ▶ sobre un track — el visualizador reacciona al audio

## Estructura

```
Music3D/
├── docker-compose.yml
├── packages/
│   ├── client/          # React + Three.js
│   │   └── src/
│   │       ├── components/  # Visualizer3D, Player, FrequencyBars
│   │       ├── hooks/       # useAudioAnalyzer
│   │       ├── pages/       # Auth, Home
│   │       ├── store/       # Zustand (auth + player)
│   │       └── api/         # Axios client
│   └── server/          # Express + Mongoose
│       └── src/
│           ├── models/      # User, Playlist
│           ├── routes/      # auth, playlists, audio proxy
│           └── middleware/  # JWT auth
└── package.json
```

## Variables de entorno

El archivo `packages/server/.env` ya está configurado para desarrollo local con Docker.
