import { NextFunction, Request, Response } from "express";
import { BadRequest, UnAuthorizedRequest } from "../errors/badRequest";
import {
  SESSION_NAME,
  SESSION_MAX_AGE,
  CONFIRM_PASSWORD_TIME,
  SESSION_REMEMBER_ME_MAX_AGE,
} from "../configs";
import { nextTick } from "process";
import { getRepository } from "typeorm";

export function isAlreadyLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (isLoggedIn(req)) {
    throw new BadRequest("Already logged In");
  } else {
    next();
  }
}

export function shouldBeLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!isLoggedIn(req)) {
    throw new UnAuthorizedRequest("not logged in");
  } else {
    next();
  }
}

// middleware that logs out user if they have been logged in for more than a certain absolute time
// its a security measure
export async function logOutIfTooLong(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("hmmmmm");
    if (isLoggedIn(req)) {
      console.log("hehe");
      const now = Date.now();
      const createdAt: number = req.session!.createdAt;
    
      
      if (req.session!.rememberMe) {
        if (now > createdAt + +SESSION_REMEMBER_ME_MAX_AGE) {
          await logOut(req, res);
          console.log("logging out");
          return next(new UnAuthorizedRequest("session expired"));
        }
      } else {
        if (now > createdAt + +SESSION_MAX_AGE) {
          await logOut(req, res);
          console.log("logging out");
          return next(new UnAuthorizedRequest("session expired"));
        }
      }
    }

    next();
  } catch (err) {
    next(err);
  }
}

export function logIn(
  req: Request,
  userID: string,
  rememberMe: boolean = false
) {
  req.session!.userID = userID;
  req.session!.createdAt = Date.now();
  req.session!.lastLogin = Date.now();
  //@ts-ignore
  req.session!.sessionMeta = req[Symbol.for("agent")];

  req.session!.sessionMeta.ipAddress = req.connection.remoteAddress;

  if (rememberMe) {
    req.session!.rememberMe = rememberMe;
    
    console.log(SESSION_REMEMBER_ME_MAX_AGE)
    // set expiry date on cookie as well 
    req.session!.cookie.maxAge = +SESSION_REMEMBER_ME_MAX_AGE
  }
}

export const isLoggedIn = (req: Request): boolean =>  !!req.session?.userID;

export function logOut(req: Request, res: Response) {
  return new Promise((resolve, reject) => {
    req.session!.destroy((err) => {
      if (!err) {
        res.clearCookie(SESSION_NAME);
        resolve();
      } else {
        reject(err);
      }
    });
  });
}

// TODO: extract out the user activatedAt action to its own function
// export async function markAsVerified(){
//   // update activated at
//   await getRepository(User).update(validID!.id, {activatedAt: new Date()})
// }

export function reAuthenticate(timeFromNow: number | null = null) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (isLoggedIn(req)) {
      const lastLogin: number = req.session!.lastLogin;
      const now = Date.now();
      if (now > lastLogin + (timeFromNow ?? +CONFIRM_PASSWORD_TIME)) {
        return next(
          new UnAuthorizedRequest("You need to provide your password again")
        );
      }
    }

    next();
  };
}

