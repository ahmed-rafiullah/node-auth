import { SessionOptions } from "express-session";


const ONE_MINUTE = 1000 * 60 * 1
const FIVE_MINUTES =  1000 * 60 * 5
const THIRTY_MINUTES = 1000 * 60 * 30;
const ONE_HOUR = THIRTY_MINUTES * 2
const SIX_HOURS = ONE_HOUR * 6;
const ONE_DAY = ONE_HOUR * 24
const ONE_WEEK = ONE_DAY * 7
const IS_PROD = process.env.NODE_ENV === 'production'



export const {
  
  COOKIE_SECRET = "example",
  SESSION_NAME = "sid",
  SESSION_MAX_AGE = THIRTY_MINUTES,
  SESSION_REMEMBER_ME_MAX_AGE = ONE_WEEK,
  PASSWORD_RESET_TIMEOUT = FIVE_MINUTES,
  CONFIRM_PASSWORD_TIME = ONE_MINUTE
} = process.env;



export const SESSION_OPTION: SessionOptions = {
  secret: COOKIE_SECRET,
  name: SESSION_NAME,
  cookie: {
    maxAge: +SESSION_MAX_AGE,
    secure: IS_PROD,
    sameSite: false,

  },
  saveUninitialized: false,
  rolling: true,
  resave: false
  
};


console.log(SESSION_OPTION)

export const PASSWORD_RESET_BYTES = 40





