FROM node:20.19.3

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build
CMD ["npm", "start"]