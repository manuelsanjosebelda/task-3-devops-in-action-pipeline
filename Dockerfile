# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build


# Stage 2: Serve the application without root privileges
FROM nginxinc/nginx-unprivileged:stable-alpine

# Temporarily switch to root to update system packages
USER root

RUN apk upgrade --no-cache

# Return to the unprivileged nginx user
USER 101

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]