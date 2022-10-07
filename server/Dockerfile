# Dependencies
FROM node:16-alpine AS dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 1000000

# Builder
FROM node:16-alpine AS builder
WORKDIR /app

COPY src ./src
COPY package.json yarn.lock tsconfig.json ./
COPY --from=dependencies /app/node_modules ./node_modules

RUN yarn build

# Runner
FROM node:16-alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist ./

EXPOSE 3001
ENV PORT 3001

CMD ["node", "."]
