import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { createConnection, getManager, MongoClient } from "typeorm";
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
import { parseUserAgent } from "./middlewares/userAgent";

// let RedisStore = connectRedis(session);

// let redisClient = redis.createClient(REDIS_OPTIONS);

 import mongoStore from  'connect-mongo'

 import mongoose from 'mongoose'

 const MongoStoreWithSession = mongoStore(session)

// redisClient.on("error", (err) => {
//   console.log(err);
// });

const app = express();







app.use(helmet())
// setup sessions using redis
app.use(
  session({
    ...SESSION_OPTION,
    store:  new MongoStoreWithSession({
       mongooseConnection: mongoose.connection,
       stringify: false,
    })
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
  .then(() => {

    return mongoose.connect('mongodb://root:example@localhost:27017/session/?authSource=admin',{ dbName: 'session-cache' ,useNewUrlParser: true, useUnifiedTopology: true})
  
  }).then(() => {
    console.log("Connected to database");
    app.listen(APP_PORT, () => {
      console.log(`Server is running on PORT: ${APP_PORT}`);
    });
  })
  .catch((error) => console.log(error));


process.on("uncaughtException", onUnhandledException);

process.on("unhandledRejection", onUnhandledRejection);


// db.getCollection('sessions').find({ $and: [{ 'session.userID' : {$eq: '8a375c22-9861-48cc-b3d4-d938007b3b8d'} }, {_id: { $nin: ['UTfJjR6nekmWuKUyoF38gnxjDsfnrrEN'] }}]});


// db.getCollection('sessions').deleteMany({ $and: [{ 'session.userID' : {$eq: '8a375c22-9861-48cc-b3d4-d938007b3b8d'} }, {_id: { $nin: ['UTfJjR6nekmWuKUyoF38gnxjDsfnrrEN'] }}]});