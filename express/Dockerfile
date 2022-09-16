FROM node:18.9.0-alpine3.15

WORKDIR /express
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
