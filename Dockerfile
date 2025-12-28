FROM node:22-alpine AS base

# --- STAGE 1: Bağımlılıkları Yükle ---
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
# Burada NODE_ENV belirtmiyoruz ki tüm paketler (Tailwind dahil) yüklensin
RUN npm install

# --- STAGE 2: Build Aşaması ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# KRİTİK: Buradan NODE_ENV=development satırını SİLDİK. 
# Next.js build komutu zaten kendi içinde üretim optimizasyonunu yapacak.
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# --- STAGE 3: Çalıştırma Aşaması (Runner) ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
