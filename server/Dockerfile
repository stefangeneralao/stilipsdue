# Dependencies
FROM node:16-alpine AS dependencies
WORKDIR /dependencies
COPY ./server/package.json ./server/yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 1000000

# Builder
FROM node:16-alpine AS builder
WORKDIR /builder
COPY ./server ./server/
COPY --from=dependencies /dependencies/node_modules ./server/node_modules
RUN yarn --cwd server build

# Runner
FROM node:16-alpine AS runner
WORKDIR /runner
COPY --from=builder /builder/server/dist ./
CMD ["node", "."]
