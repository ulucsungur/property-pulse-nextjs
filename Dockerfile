# ===============================
# 1️⃣ BASE
# ===============================
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# ===============================
# 2️⃣ DEPENDENCIES
# ===============================
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# ===============================
# 3️⃣ BUILD
# ===============================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Turbopack ile build (Next 15)
RUN npm run build

# ===============================
# 4️⃣ RUNTIME (STANDALONE)
# ===============================
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

# Cloud Run ve güvenlik için non-root user oluşturma
RUN addgroup -g 1001 nodejs \
    && adduser -u 1001 -G nodejs -s /bin/sh -D nextjs

# Standalone çıktılarını kopyalama
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# CACHE İZNİ: Klasörü oluştur ve sahipliğini nextjs kullanıcısına ver
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next/cache

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
