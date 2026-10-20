FROM node:20-slim
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
# ชื่อ service ของ backend ใน docker compose (ใช้ตอน build เพราะ rewrites ถูกกำหนดตอน build)
ENV BACKEND_URL=http://backend:3001
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
