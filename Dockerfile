FROM node:alpine

LABEL org.opencontainers.image.source = "https://github.com/IceBrick01/nZip"

WORKDIR /app

COPY . /app
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]