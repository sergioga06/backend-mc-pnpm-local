FROM node:20-alpine

# Instalamos openssl que requiere Prisma
RUN apk update && apk add --no-cache bash openssl

WORKDIR /app

# Copiamos la configuración del monorepo
COPY package.json pnpm-workspace.yaml ./
COPY apps/ms-usuarios/package.json ./apps/ms-usuarios/
COPY apps/ms-usuarios/prisma ./apps/ms-usuarios/prisma

# IMPORTANTE: Eliminamos el uso de pnpm en Docker. 
# Usamos NPM para crear un árbol de dependencias PLANO (sin symlinks)
RUN npm install -g npm@latest
RUN cd apps/ms-usuarios && npm install --omit=dev

# Instalamos el CLI de Prisma e inicializamos
RUN cd apps/ms-usuarios && npm install prisma --no-save
RUN cd apps/ms-usuarios && npx prisma generate

# Copiamos el código de NestJS
COPY dist/apps/ms-usuarios ./dist/apps/ms-usuarios

EXPOSE 3001

CMD ["node", "dist/apps/ms-usuarios/main.js"]