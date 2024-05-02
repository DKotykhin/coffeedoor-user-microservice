# CoffeeDoor online shop

![Logo](https://coffeedoor-next14-sql.vercel.app/logo_700x191.webp)

## Description

User microservice for CoffeeDoor online shop

## Technologies

-   NestJS, gRPC, TypeORM, postgreSQL, Typescript, bcrypt, sendGrid

## Features

-   sign in and sign up function
-   email confirmation for registration
-   restore and update password with email token notification
-   CRUD for users
-   health check service

## Environment Variables

To run this project locally, you will need to add the following environment variables to your .env file. See in .env.example in root directory

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Author

Dmytro Kotykhin
-   [Github](https://github.com/DKotykhin)
-   [Web](https://dmytro-kotykhin.pp.ua)
-   [LinkedIn](https://www.linkedin.com/in/dmytro-kotykhin-4683151b)
