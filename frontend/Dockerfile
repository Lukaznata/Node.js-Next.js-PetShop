FROM node:22

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install sharp

EXPOSE 3000

CMD ["npm", "run", "start"]