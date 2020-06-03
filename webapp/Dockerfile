FROM node:13-alpine as builder

WORKDIR /app

ENV NODE_ENV production

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY webpack.config.ts .
COPY tsconfig.json .
COPY assets assets
COPY src src

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /www
COPY conf/nginx.conf  /etc/nginx/nginx.conf
COPY conf/proxy.conf  /etc/nginx/proxy.template
COPY ssl /etc/ssl

ENTRYPOINT envsubst < /etc/nginx/proxy.template > /etc/nginx/proxy.conf && nginx -g 'daemon off;'
