FROM node:latest as clientbuild

RUN mkdir /client
WORKDIR /client
COPY client/package.json /client
RUN npm install

WORKDIR /client
COPY client/ /client
RUN npm run build

FROM node:latest

RUN mkdir /server

WORKDIR /server
COPY server/package.json /server
RUN npm install

COPY --from=clientbuild /client/dist/ /server/static

WORKDIR /server
COPY server/ /server

CMD [ "index.js" ]
