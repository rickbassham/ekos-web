FROM node:latest

RUN mkdir /client
WORKDIR /client
COPY client/package.json /client
RUN npm install

WORKDIR /client
COPY client/ /client
RUN npm run build

RUN mkdir /server
RUN cp -r /client/dist/ /server/static

RUN rm -Rf /client

WORKDIR /server
COPY server/package.json /server
RUN npm install

WORKDIR /server
COPY server/ /server

CMD [ "index.js" ]
