import mongoose from 'mongoose'
import {RateLimiterMongo, RateLimiterRes} from 'rate-limiter-flexible'
import { Response, Request, NextFunction } from "express";

 const opts = {
    storeClient: mongoose.connection,
    points: 2, // Number of points
    duration: 1, // Per second(s)
    blockDuration: 300
    
  };
    
 



  export const maxConsecutiveFailsByEmailAndIp = 10;
  export const maxWrongAttemptsByIpPerDay = 100;




  export const limiterSlowBruteByIP = new RateLimiterMongo({
    storeClient: mongoose.connection,
    keyPrefix: 'login_fail_ip_per_day',
    points: maxWrongAttemptsByIpPerDay,
    duration: 60 * 60 * 24, // reset after one day
    blockDuration: 60 * 5, // Block for 1 day, if 100 wrong attempts per day
  });
  
  export const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMongo({
    storeClient: mongoose.connection,
    keyPrefix: 'login_fail_consecutive_username_and_ip',
    points: maxConsecutiveFailsByEmailAndIp,
    duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
    blockDuration: 60 * 2, // Block for 1 hour
  });
  

 

  // export function lockAccountIfTooManyFailedAttempts(err: Error , req: Request, res: Response, next: NextFunction) {

  //   // get body parse the value silently 


  //   // evaluate attempts if over limit set lock for current user in db


  //   // and only allow after x seconds


  // }