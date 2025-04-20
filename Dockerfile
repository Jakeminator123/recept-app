FROM node:18-alpine
RUN apk add --no-cache openssl

EXPOSE 3000

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./

RUN npm ci && npm cache clean --force
# Remove CLI packages since we don't need them in production by default.
# Remove this line if you want to run CLI commands in your container.
RUN npm remove @shopify/cli

COPY . .

RUN npm run build
# Säkerställ att app/build finns och innehåller filerna
RUN mkdir -p ./app/build && [ -d "./build" ] && cp -r ./build/* ./app/build/ || echo "build directory doesn't exist yet"

CMD ["npm", "run", "docker-start"]
