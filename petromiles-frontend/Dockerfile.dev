# FRONTEND

FROM node:alpine as builder
WORKDIR '/app'

RUN apk update && apk upgrade && apk add --no-cache bash git openssh

COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "run", "serve"]
