import { SessionOptions } from "express-session";
import { resolve } from "path";

const HALF_HOUR = 1000 * 60 * 30;
const IS_PROD = process.env.NODE_ENV === 'production'

export const {
  COOKIE_SECRET = "development",
  SESSION_NAME = "sid",
  SESSION_MAX_AGE = HALF_HOUR,
} = process.env;

export const SESSION_OPTION: SessionOptions = {
  secret: COOKIE_SECRET,
  name: SESSION_NAME,
  cookie: {
    maxAge: +SESSION_MAX_AGE,
    secure: IS_PROD,
    sameSite: true,

  },
  saveUninitialized: false,
  rolling: true,
  resave: false
  
};
