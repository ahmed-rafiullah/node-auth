import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { createConnection, getManager } from "typeorm";
import express, { Request, Response, NextFunction } from "express";
import { userRouter } from "./routers";
import helmet from 'helmet'

import { SESSION_OPTION, REDIS_OPTIONS, APP_PORT } from "./configs";

import redis from "redis";

import session from "express-session";
import connectRedis from "connect-redis";
import { User } from "./entities/User";
import { onUnhandledException, onUnhandledRejection, removeExpiredPasswordResetTokens } from "./utils";
import { notFoundErrorHandler,internalServerErrorOrAppErrorHandler, logOutIfTooLong } from "./middlewares";

let RedisStore = connectRedis(session);

let redisClient = redis.createClient(REDIS_OPTIONS);

redisClient.on("error", (err) => {
  console.log(err);
});

const app = express();

app.use(helmet())
// setup sessions using redis
app.use(
  session({
    ...SESSION_OPTION,
    store: new RedisStore({ client: redisClient }),
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(logOutIfTooLong)

app.use("/user", userRouter);

// 404 not found
app.use(notFoundErrorHandler);

// internal server errors
app.use(internalServerErrorOrAppErrorHandler);

// picks up ormconfig.js automaticallyy

createConnection()
  .then((connection) => {
    // here you can start to work with your entities
    
    console.log("Connected to database");
    app.listen(APP_PORT, () => {
      console.log(`Server is running on PORT: ${APP_PORT}`);
    });

    // start cron job now
    // removeExpiredPasswordResetTokens.start()
  })
  .catch((error) => console.log(error));


process.on("uncaughtException", onUnhandledException);

process.on("unhandledRejection", onUnhandledRejection);


