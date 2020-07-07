
 import {ClientOpts} from 'redis'

 const {

    REDIS_PORT = 6379,
    REDIS_PASSWORD = 'secret',
    REDIS_HOST = 'localhost',

    
} = process.env


export const REDIS_OPTIONS: ClientOpts = {
    host: REDIS_HOST,
    port: +REDIS_PORT,
    password: REDIS_PASSWORD
}