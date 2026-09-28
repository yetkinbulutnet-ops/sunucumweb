# SunucumWEB - Next.js 15 uretim imaji
# Bunny Magic Containers / herhangi bir Docker ortami icin.
#
# Build:  docker build -t <kullanici>/sunucumweb:latest .
# Calis:  docker run -p 3000:3000 -e GROQ_API_KEY=... <kullanici>/sunucumweb:latest

# ---------- 1) bagimliliklar ----------
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- 2) derleme ----------
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# DEMO icin arama motorlarina KAPALI derlenir.
# Canliya cikarken: --build-arg SITE_INDEXABLE=1
ARG SITE_INDEXABLE=0
ENV SITE_INDEXABLE=$SITE_INDEXABLE
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=1

# Tailwind CSS + Next build (package.json'daki "build" script'i ikisini de yapar)
RUN npm run build

# ---------- 3) calistirma ----------
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# root olmayan kullanici
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# standalone cikti: kendi mini sunucusunu tasir, node_modules gerektirmez
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Basit saglik kontrolu: motor durumu ucu
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
