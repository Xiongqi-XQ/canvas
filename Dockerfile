# FROM node:8.9-alpine
# ENV NODE_ENV production
# WORKDIR /usr/src/app
# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --production --silent && mv node_modules ../
# COPY . .
# EXPOSE 3000
# CMD npm start

FROM node:8.9-alpine
# ENV NODE_ENV production
WORKDIR /usr/src/canvas
COPY *.css ./
COPY *.js ./
COPY *.html ./
CMD node ./node-server.js
EXPOSE 3000
