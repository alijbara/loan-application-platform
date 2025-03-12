# Stage 1: Base image
FROM node:23-alpine AS base

# Stage 2: Install dependencies
FROM base AS deps

RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --prod

# Stage 3: Build the application
FROM base AS build

RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 4: Serve
FROM nginx:stable-alpine AS production

WORKDIR /app
COPY --from=build /app/dist /usr/share/nginx/html
COPY start-nginx.sh /start-nginx.sh 
RUN chmod +x /start-nginx.sh
ENV NODE_ENV=production
# Start the application
CMD ["/start-nginx.sh"]
