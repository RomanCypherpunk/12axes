# Deploy do 12 Axes

## Backend no Render

Crie um Web Service conectado ao repositorio.

- Runtime: Docker
- Root Directory: `backend`
- Instance Type: Free
- Health Check Path: `/api/health`
- Environment variable:
  - `FRONTEND_ORIGINS=https://seu-frontend.vercel.app`

O backend usa `server.port=${PORT:8080}`, entao o Render injeta a porta automaticamente.

## Frontend na Vercel

Crie um projeto apontando para a pasta `frontend`.

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variable:
  - `VITE_API_URL=https://seu-backend.onrender.com`

Depois que a URL final da Vercel existir, atualize `FRONTEND_ORIGINS` no Render com esse dominio.
