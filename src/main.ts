import dotenv from 'dotenv'
dotenv.config()
import "reflect-metadata";
import {createConnection, getManager} from "typeorm";
import express from 'express'

import {SESSION_OPTION,PORT, REDIS_OPTIONS} from './configs'

import redis  from 'redis'

import session from 'express-session'
import connectRedis from 'connect-redis'
import { Photo } from './entities/Photo';


 
let RedisStore = connectRedis(session)

let redisClient = redis.createClient(REDIS_OPTIONS)

redisClient.on("error", (err) => {
  console.log(err)
})



 

const app = express()


// setup sessions using redis
app.use(
    session({
      ...SESSION_OPTION,
      store: new RedisStore({ client: redisClient }),
    })
  )

app.use('/', (req,res) =>{

  const photo = new Photo()
  photo.description = 'sdasds'
  photo.filename = 'noice.jpg'
  photo.isPublished = false
  photo.name = 'noice'
  photo.views = 123

  getManager().save(photo).then(photo => {
      console.log(photo)
      
      res.json({
        photo
      })
    })
   
})


// picks up ormconfig.js automaticallyy
createConnection().then(connection => {
  // here you can start to work with your entities

  console.log('Connected to database')
  app.listen(PORT, ()=> {
    console.log(`Server is running on PORT: ${PORT}`)
})
}).catch(error => console.log(error));


