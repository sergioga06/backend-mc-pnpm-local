FROM node:20-alpine

RUN apk update && apk add --no-cache bash

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/ms-client-gateway/package.json ./apps/ms-client-gateway/

RUN npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile --ignore-scripts

COPY dist/apps/ms-client-gateway ./dist/apps/ms-client-gateway

EXPOSE 3000

CMD ["node", "dist/apps/ms-client-gateway/main.js"]