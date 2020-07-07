import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../errors/badRequest";
import { SESSION_NAME } from "../configs";


export function isAlreadyLoggedIn(req: Request, res: Response, next: NextFunction ) {
   if(isLoggedIn(req)) {
       throw new BadRequest('Already logged In')
   } else {
       next()
   }
}


export function shouldBeLoggedIn(req: Request, res: Response, next: NextFunction ) {
    if(!isLoggedIn(req)) {
        throw new BadRequest('not logged in')
    } else {
        next()
    }
 }



export function logIn(req: Request, userID: string) {
    req.session!.userID = userID
}

export const isLoggedIn = (req: Request ) => !!req.session!.userID


export function logOut(req: Request, res: Response) {
   return  new Promise((resolve,reject) => {
        req.session!.destroy((err) => {

            if(!err) {
                res.clearCookie(SESSION_NAME)
                resolve()
            } else {
             
                reject(err)
            }
      
          })
    })

}
 


