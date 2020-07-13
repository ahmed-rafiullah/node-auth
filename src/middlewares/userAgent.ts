import * as parser from 'ua-parser-js'
import { Request, Response, NextFunction } from 'express';

const agent = Symbol.for('agent')





export function parseUserAgent(){

const agentParser = new parser.UAParser()

return function(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    req[agent] = agentParser.setUA(req.get('user-agent')).getResult()

    next()

}

}