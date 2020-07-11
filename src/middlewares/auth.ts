import { NextFunction, Request, Response } from "express";
import { BadRequest, UnAuthorizedRequest } from "../errors/badRequest";
import { SESSION_NAME, ABSOLUTE_TIME_OUT, SESSION_MAX_AGE } from "../configs";
import { nextTick } from "process";
import {getRepository} from 'typeorm'

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
    console.log('hmmmmm')
    if (isLoggedIn(req)) {
        console.log('hehe')
      const now = Date.now();
      const createdAt = req.session!.createdAt;
      if (now > createdAt + SESSION_MAX_AGE) {
        await logOut(req, res);
        console.log('loggin out')
        return next(new UnAuthorizedRequest('session expired'))
      }
    } 

    next()

  } catch (err) {
    next(err);
  }
}

export function logIn(req: Request, userID: string) {
  req.session!.userID = userID;
  req.session!.createdAt = Date.now();
}

export const isLoggedIn = (req: Request) => !!req.session!.userID;

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