import { SessionOptions } from "express-session";


const ONE_MINUTE = 1000 * 60 * 1
const FIVE_MINUTES =  1000 * 60 * 5
const THIRTY_MINUTES = 1000 * 60 * 30;
const ONE_HOUR = THIRTY_MINUTES * 2
const SIX_HOURS = ONE_HOUR * 6;
const IS_PROD = process.env.NODE_ENV === 'production'



export const {
  
  COOKIE_SECRET = "development",
  SESSION_NAME = "sid",
  SESSION_MAX_AGE = THIRTY_MINUTES,
} = process.env;

export const ABSOLUTE_TIME_OUT: number = +(process.env.ABSOLUTE_TIME_OUT ??  SIX_HOURS)

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

export const PASSWORD_RESET_TIMEOUT = FIVE_MINUTES

export const PASSWORD_RESET_BYTES = 40

export const CONFIRM_PASSWORD_TIME = ONE_MINUTE



