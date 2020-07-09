import { BadRequest } from "../errors/badRequest"
import * as yup from 'yup'

export function onUnhandledRejection (err: Error) {
    console.log(err)
}


export function onUnhandledException (err: Error) {
    console.log(err)
}


