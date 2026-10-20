FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json ./
COPY prisma ./prisma
RUN npm install
COPY . .
ENV NODE_ENV=production DATABASE_URL=file:/data/shop.db PORT=3001
EXPOSE 3001
CMD ["sh", "-c", "npx prisma db push --skip-generate && npx prisma db seed && npm start"]
