FROM node:20-alpine

# Argumentos
ARG MICROSERVICIO
ENV MICROSERVICIO=${MICROSERVICIO}

# 1. Instalamos herramientas
RUN apk update && apk add --no-cache bash git openssh-client \
    && npm install -g pnpm pm2

# 2. Directorio de trabajo
WORKDIR /app

# 3. Copiamos TODO el código fuente
COPY . .

# 4. Instalamos las dependencias
RUN pnpm install

# 5. 🛑 FIX: Generamos el cliente de Prisma ANTES de compilar
RUN npx prisma generate --schema=apps/ms-usuarios/prisma/schema.prisma

# 6. 🟢 AHORA SÍ: Compilamos el código de NestJS
RUN pnpm run build ${MICROSERVICIO}

# 7. Movemos y preparamos el script de arranque
RUN cp apps/${MICROSERVICIO}/deploy/start.sh /usr/local/bin/start-app.sh && \
    chmod +x /usr/local/bin/start-app.sh && \
    sed -i 's/\r$//' /usr/local/bin/start-app.sh

EXPOSE 3001

# 8. Ejecución
CMD [ "bash", "/usr/local/bin/start-app.sh" ]