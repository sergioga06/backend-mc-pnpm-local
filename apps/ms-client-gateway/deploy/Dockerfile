FROM node:20-alpine

# Argumentos
ARG MICROSERVICIO
ENV MICROSERVICIO=${MICROSERVICIO}

# 1. Instalamos herramientas
RUN apk update && apk add --no-cache bash git openssh-client \
    && npm install -g pnpm pm2

# 2. Directorio de trabajo
WORKDIR /app

# 3. Copiamos TODO el código fuente de tu proyecto hacia el contenedor
COPY . .

# 4. Instalamos las dependencias DENTRO de Docker
RUN pnpm install

# 5. Compilamos el código de NestJS (esto genera la carpeta /dist automáticamente)
RUN pnpm run build ${MICROSERVICIO}

# 6. Movemos y preparamos el script de arranque
RUN cp apps/${MICROSERVICIO}/deploy/start.sh /usr/local/bin/start-app.sh && \
    chmod +x /usr/local/bin/start-app.sh && \
    sed -i 's/\r$//' /usr/local/bin/start-app.sh

EXPOSE 3000

# 7. Ejecución
CMD [ "bash", "/usr/local/bin/start-app.sh" ]