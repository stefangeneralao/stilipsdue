# Dependencies
FROM node:16-alpine AS dependencies
WORKDIR /dependencies
COPY ./app/package.json ./app/yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 1000000

# Builder
FROM node:16-alpine AS builder
WORKDIR /builder
COPY ./types ./types
COPY ./app ./app/
COPY --from=dependencies /dependencies/node_modules ./app/node_modules
ARG VITE_API_URL
RUN yarn --cwd app build --base=/stilipsdue/

# Runner
FROM nginx:alpine AS runner
COPY --from=builder /builder/app/dist /usr/share/nginx/html/
CMD ["nginx", "-g", "daemon off;"]
