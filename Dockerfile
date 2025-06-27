FROM node:lts-alpine3.22

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build
CMD ["npm", "start"]