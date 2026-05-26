#!/bin/bash
set -e

echo "🚀 [START.SH] Arrancando microservicio: ${MICROSERVICIO}"

# 1. Ir a la carpeta raíz donde Jenkins dejó el código
cd /app

# 2. Buscar el archivo ejecutable que NestJS generó en el build de Jenkins
# Lo buscamos en dist/apps/nombre-del-servicio/main.js
ARCHIVO_MAIN=$(find ./dist -name "main.js" | grep "${MICROSERVICIO}" | head -n 1)

if [ -z "$ARCHIVO_MAIN" ]; then
    echo "❌ ERROR: No se encontró el build en ./dist para ${MICROSERVICIO}"
    echo "Contenido actual de /app/dist:"
    ls -R ./dist
    exit 1
fi

echo "✅ [OK] Ejecutable encontrado en: $ARCHIVO_MAIN"
echo "🔥 Iniciando con PM2..."

# 3. Lanzar la aplicación directamente
exec pm2-runtime start "$ARCHIVO_MAIN" --name "${MICROSERVICIO}"