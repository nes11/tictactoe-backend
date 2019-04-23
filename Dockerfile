FROM node:8.10.0
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 4000
CMD [ "npm", "start" ]