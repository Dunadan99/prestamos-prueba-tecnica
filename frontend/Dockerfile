FROM node:20.13.1-bookworm-slim

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8080

CMD [ "npm", "run", "dev" ]