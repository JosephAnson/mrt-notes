# === Build stage (secrets available, discarded after build) ===
FROM node:18-alpine AS build

ARG REDIS_HOST
ARG REDIS_PASSWORD
ARG GOOGLE_ADSENSE_ID
ARG BLIZZARD_CLIENT_ID
ARG BLIZZARD_CLIENT_SECRET
ARG SUPABASE_URL
ARG SUPABASE_KEY

ENV NITRO_PRESET=node-server
ENV REDIS_HOST=${REDIS_HOST}
ENV REDIS_PASSWORD=${REDIS_PASSWORD}
ENV GOOGLE_ADSENSE_ID=${GOOGLE_ADSENSE_ID}
ENV BLIZZARD_CLIENT_ID=${BLIZZARD_CLIENT_ID}
ENV BLIZZARD_CLIENT_SECRET=${BLIZZARD_CLIENT_SECRET}
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_KEY=${SUPABASE_KEY}

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# === Runtime stage (clean, no secrets in any layer) ===
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/.output .output

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
