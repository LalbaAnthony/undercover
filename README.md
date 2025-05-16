# 🎭 - Memo Minder

## 📖 Technos

- [Vue.js](https://vuejs.org/)
- [Tailwind](https://tailwindcss.com/)
- [Headless UI](https://headlessui.dev/)

## 🚀 Quick Start

### Config

Create a `.env` file in the project directory. Use the `.env.example` file as a template.

### Frontend

```bash
cd front/ && npm i && npm run dev
```

## 🚢 Deployment

### Secrets

Those secrets are required in the deployment environment:
- `PROD_SERVER_IP`: The server IP address
- `PROD_SERVER_USER`: The server user
- `PROD_SERVER_PRIVATE_KEY`: The private key to connect to the server (could use `cat ~/.ssh/id_rsa` on local machine to get it)
- `PROD_VITE_*`: The Vite environment variables, they're all stored as secrets in github and used to recreate the `.env` right before the build

### Environment

In production, `.env` file must be created in the project directory to feed backend. Use the `.env.prod` file as a template.

PM2 is used to manage the Node.js process. Make sure to install it on the server.

```bash
# Install NPM
sudo apt install npm

# Install PM2
npm i -g pm2
```

### Web server

Apache is used to serve the frontend. Make sure to install it on the server.

Use the `apache.prod.conf` file to configure the virtual host.