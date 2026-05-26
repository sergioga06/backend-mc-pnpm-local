# 1. LA BASE
# Empezamos con una imagen que ya tiene Node.js v20 instalado (el motor que ejecuta tu código).
# Es como comprar un ordenador que ya trae Windows y los drivers listos.
FROM node:20

# 2. VARIABLES (INGREDIENTES OPCIONALES)
# Definimos variables que podemos cambiar al construir la imagen
# (por ejemplo, para decirle "hoy vamos a construir el microservicio de usuarios").
ARG CONTEXTO
ARG MICROSERVICIO
ARG APP_MS=./apps/${MICROSERVICIO}

# 3. CARPETA DE TRABAJO
# Creamos una carpeta llamada '/app' dentro del contenedor y nos metemos en ella.
# A partir de ahora, todo lo que hagamos ocurrirá aquí dentro.
WORKDIR /app

# 4. INSTALAR HERRAMIENTAS
# Instalamos 'pnpm' (el gestor de paquetes que usas en lugar de npm) de forma global.
RUN npm install -g npm@11.6.4 \
    && npm install -g pnpm

# Configuración extra para que pnpm sepa dónde guardar los ejecutables.
RUN pnpm config set global-bin-dir /usr/local/bin

# 5. PREPARAR LA INSTALACIÓN (EL TRUCO DEL CACHÉ)
# Primero copiamos SOLO los archivos de configuración y la lista de dependencias (package.json).
# ¿Por qué? Porque si tu código cambia pero tus librerías no, Docker se salta el paso de instalar
# y ahorra mucho tiempo.
COPY ${APP_MS}/src ./${APP_MS}/src
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./
COPY tsconfig.json ./

# Copiamos la configuración del CLI de NestJS.
COPY nest-cli.json ./

# 6. INSTALAR DEPENDENCIAS
# Descarga e instala todas las librerías que necesita tu proyecto.
RUN pnpm install --frozen-lockfile

# Instalamos herramientas globales útiles para gestionar el proceso (PM2 ayuda a mantener la app viva).
RUN pnpm add -g @nestjs/cli pm2

# 7. COPIAR EL CÓDIGO FUENTE
# Ahora que las librerías están instaladas, copiamos el resto de tu código real.
# Copiamos el código del microservicio específico.
COPY ${APP_MS}/src ./${APP_MS}/src
COPY ${APP_MS}/tsconfig.build.json ./${APP_MS}/

# Copiamos las librerías compartidas (la carpeta 'libs' del monorepo).
COPY libs ./libs

# 8. EL ARRANQUE
# Copiamos el guion (script) que dice cómo encender el microservicio.
COPY ${APP_MS}/deploy/start.sh ./

# Le damos permisos para que se pueda ejecutar (como darle la llave del coche).
RUN chmod +x ./start.sh

# A título informativo, decimos que este contenedor usará el puerto 3000.
EXPOSE 3000

# 9. PUNTO DE PARTIDA
# Esta es la orden final: "Cuando el contenedor arranque, ejecuta este script inmediatamente".
ENTRYPOINT [ "./start.sh" ]