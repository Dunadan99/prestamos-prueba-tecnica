FROM node:20.13.1-bookworm-slim

WORKDIR /app/frontend

COPY . .

RUN npm install

EXPOSE 8080

CMD [ "npm", "run", "dev" ]