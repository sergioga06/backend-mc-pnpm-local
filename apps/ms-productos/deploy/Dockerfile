# 1. IMAGEN BASE
FROM node:20-alpine

# 2. ACTIVAR PNPM (Importante para monorepos)
RUN corepack enable && corepack prepare pnpm@latest --activate

# 3. VARIABLES DE CONSTRUCCIÓN
ARG CONTEXTO=.
ARG MICROSERVICIO=ms-productos
ARG APP_MS=./apps/${MICROSERVICIO}

WORKDIR /app

# 4. HERRAMIENTAS
RUN apk add --no-cache openssl git bash

# 5. CONFIGURACIÓN (CACHÉ)
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY .npmrc .
COPY tsconfig.json .
COPY nest-cli.json .

# 6. COPIAR CÓDIGO FUENTE
COPY libs ./libs
COPY apps/${MICROSERVICIO} ./apps/${MICROSERVICIO}

# --- [AQUÍ ESTABA EL ERROR] ---
# 7. INSTALAR Y COMPILAR
# Sin esto, la carpeta 'dist' no se genera y el start.sh falla.
RUN pnpm install --frozen-lockfile
RUN pnpm run build ${MICROSERVICIO}
# ------------------------------

# 8. SCRIPT DE ARRANQUE
COPY ${APP_MS}/deploy/start.sh .
RUN chmod +x ./start.sh

# 9. PUERTO
EXPOSE 3002

CMD ["./start.sh"]