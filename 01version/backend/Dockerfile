# Use the official Node.js 18 image as the base
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# default command (will be overridden by docker-compose)
CMD ["node", "server.js"]
