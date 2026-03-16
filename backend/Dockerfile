FROM node:20-alpine

# Install ExifTool (required for IPTC/EXIF metadata writing)
RUN apk add --no-cache perl exiftool

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

RUN mkdir -p /app/uploads

EXPOSE 4000
CMD ["node", "dist/index.js"]
