FROM node:18-alpine

WORKDIR /workspace

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
LABEL org.opencontainers.image.source=https://github.com/PingoLeon/webtech-106
