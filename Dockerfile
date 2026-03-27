FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* ./
RUN \
if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
fi

FROM base AS builder
WORKDIR /app
ARG NEXT_PRIVATE_STANDALONE=true

ARG BASE_API_URL=https://goftby-be.onrender.com

ENV BASE_API_URL=$BASE_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
if [ -f yarn.lock ]; then yarn run build; \
fi

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV BASE_API_URL=https://goftby-be.onrender.com

COPY --from=builder /app/public ./public

RUN mkdir .next

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node server.js
