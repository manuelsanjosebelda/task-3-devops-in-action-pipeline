# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

FROM nginx/nginx-unprivileged:1.30.7-alpine3.24

USER root

RUN apk upgrade --no-cache

USER 101


COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]