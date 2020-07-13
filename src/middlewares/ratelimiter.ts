import mongoose from 'mongoose'
import {RateLimiterMongo} from 'rate-limiter-flexible'

const opts = {
    storeClient: mongoose.connection,
    points: 10, // Number of points
    duration: 1, // Per second(s)
  };
    
  export const rateLimiterMongo = new RateLimiterMongo(opts);

  