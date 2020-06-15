# VUE COMPILATION
FROM node:alpine as builder
WORKDIR '/app'

RUN apk update && apk upgrade && apk add --no-cache bash git openssh

COPY package.json ./
RUN npm install

COPY . .
RUN $(npm bin)/vue-cli-service build --mode production

# NGINX
FROM nginx
COPY ./nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]