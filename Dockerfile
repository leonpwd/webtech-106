FROM node:18-alpine

WORKDIR /workspace

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run install:labs

CMD ["npm", "run", "all"]
