import { Response, Request, NextFunction } from "express";
import { BadRequest } from "../errors/badRequest";

// it should always have error handler in its signature other wise it wont work
export function internalServerErrorOrAppErrorHandler(err: Error , req: Request, res: Response, next: NextFunction) {
    console.log(err);

    //@ts-ignore
    if(err.status){
      //@ts-ignore
      return  res.status(err.status).json({
        message: err.message
      });
    }

    //@ts-ignore
    return  res.status(500).json({
      message: 'Internal Server Error'
    });
    
}

// not found handler should never have error in its function signature other wise it wont work
export function notFoundErrorHandler(req: Request, res: Response, next: NextFunction) {
   
    res.status(404).json({
      message: "404 Not Found",
    });
  }