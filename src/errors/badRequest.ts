abstract class IHTTPError extends Error {
   status: number

}

export class BadRequest extends IHTTPError {

    constructor(message: string){
        super(message)
        this.status = 400
    }

}


export class UnAuthorizedRequest extends IHTTPError {

    constructor(message: string){
        super(message)
        this.status = 401
    }

}