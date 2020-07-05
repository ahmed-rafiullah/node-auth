import dotenv from 'dotenv'
dotenv.config()
import "reflect-metadata";
import express from 'express'

import {COOKIE_SECRET,PORT} from './configs'

import redis  from 'redis'

import session from 'express-session'
import connectRedis from 'connect-redis'
 
let RedisStore = connectRedis(session)
let redisClient = redis.createClient()
 

const app = express()


app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: COOKIE_SECRET,
      resave: false,
    })
  )

app.use('/', (req,res) =>{
    res.json({
        message: 'its working !'
    })
})

app.listen(PORT, ()=> {
    console.log(`Server is running on PORT: ${PORT}`)
})