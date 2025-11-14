FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

EXPOSE 8080

CMD ["node", "server.js"]
