#standalone container
FROM node:18 as dev

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install

COPY . /app

RUN npm run build

# CMD [ "npm", "run", "start:dev" ]
CMD [ "npm", "start" ]


# common container
FROM node:18 as prod

WORKDIR /coffeedoor-user-microservice

COPY ./coffeedoor-user-microservice/package.json /coffeedoor-user-microservice
COPY ./coffeedoor-user-microservice/package-lock.json /coffeedoor-user-microservice
COPY ./coffeedoor-user-microservice/tsconfig.json tsconfig.json
COPY ./coffeedoor-user-microservice/nest-cli.json nest-cli.json

RUN npm install

COPY /coffeedoor-user-microservice /coffeedoor-user-microservice

RUN npm run build

CMD [ "npm", "start" ]
