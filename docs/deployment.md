# Deploy do 12 Axes

## Backend no Render

Crie um Web Service conectado ao repositório.

- Runtime: Docker
- Root Directory: `backend`
- Instance Type: Free
- Health Check Path: `/api/health`
- Environment variable:
  - `FRONTEND_ORIGINS=https://12axes.vercel.app`

O backend usa `server.port=${PORT:8080}`, então o Render injeta a porta automaticamente.

URL atual de produção do backend:

```txt
https://one2axes-backend.onrender.com
```

Health check:

```txt
https://one2axes-backend.onrender.com/api/health
```

## Frontend na Vercel

Crie um projeto apontando para a pasta `frontend`.

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variable:
  - `VITE_API_URL=https://one2axes-backend.onrender.com`

Depois que a URL final da Vercel existir, atualize `FRONTEND_ORIGINS` no Render com esse domínio.

URL atual de produção do frontend:

```txt
https://12axes.vercel.app
```
