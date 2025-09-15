FROM node:18-alpine

WORKDIR /workspace

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run install:labs

CMD ["npm", "run", "all"]
LABEL org.opencontainers.image.source https://github.com/PingoLeon/webtech-106
