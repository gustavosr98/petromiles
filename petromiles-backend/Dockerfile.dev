# BACKEND
FROM node:alpine as builder
WORKDIR '/app'

# DEPENDENCIES
COPY package*.json ./
RUN npm install

# SOURCE CODE
COPY . .

# SERVICE CMD
CMD ["sh", "-c", "npm run seed && npm run start:dev"]
