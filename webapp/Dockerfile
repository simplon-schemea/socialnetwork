FROM node:13-alpine as builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /www
COPY conf/nginx.conf  /etc/nginx/
