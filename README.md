# 🎭 - Undercover

## 📖 Technos

- [Vue.js](https://vuejs.org/)
- [Tailwind](https://tailwindcss.com/)
- [Headless UI](https://headlessui.dev/)

## 🚀 Quick Start

### Config

Create a `.env` file in the project directory. Use the `.env.example` file as a template.

No Docker variable has a default value: a missing key makes `docker compose` fail
immediately instead of starting with a silently wrong configuration.

| Variable | Used by | Description                                                         |
| -------- | ------- | ------------------------------------------------------------------- |
| `PORT`   | prod    | Host port bound on `127.0.0.1`, proxied by Apache                   |
| `IMAGE`  | prod    | Full image reference, e.g. `docker.io/lalbaanthony/undercover:main` |

### Development

```bash
docker compose --profile dev up --build
```

The app is served on `http://localhost:5173` with HMR: sources are
bind-mounted, `node_modules` stays inside the container.

```bash
# Same thing, plus an automatic rebuild when package.json / package-lock.json change
docker compose --profile dev watch

# One-off commands
docker compose --profile dev exec app-dev npm run lint
docker compose --profile dev exec app-dev npm i <pkg>   # then rebuild the image
```

Running without Docker still works (`npm i ; npm run dev`).

### Production (local check)

```bash
docker compose --profile prod up -d --build
curl http://127.0.0.1:${PORT}/health
```

The production image is a multi-stage build: Vite builds the bundle, then only
`dist/` is copied into an unprivileged nginx image (no Node.js, no npm, no
sources, read-only root filesystem).

## 🚢 Deployment

Deployment is fully handled by `.github/workflows/deploy.flow.yml`: the image is
built and pushed to Docker Hub, then the server pulls it and restarts the
`prod` compose profile. The server only needs `docker`, `docker compose` and
Apache — no Node.js, no PM2.

### Secrets

Those secrets are required in the `production` environment:
- `SSH_HOST`, `SSH_PORT`, `SSH_USER`, `SSH_PRIVATE_KEY`: SSH access to the server
- `FOLDER`: Deployment directory, relative to the user home
- `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`: Registry credentials
- `PORT`: Host port the container publishes on `127.0.0.1`
- `VITE_*`: The Vite environment variables, stored as secrets in GitHub, injected as build args and written to the server `.env`

### Web server

Apache stays in front as a TLS-terminating reverse proxy. Make sure to install
it on the server and use the `apache.conf` file to configure the virtual host —
its `ProxyPass` target must match `PORT`.