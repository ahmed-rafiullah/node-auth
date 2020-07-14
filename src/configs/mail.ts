import {Options} from 'nodemailer/lib/smtp-connection'
import { APP_HOSTNAME } from './server'

export const {
    SMTP_HOST = 'smtp.ethereal.email',
    SMTP_PORT = 587 ,
    SMTP_USER,
    SMTP_PASSWORD,
    EMAIL_VERIFICATION_EXPIRY_TIME = '5m'

} = process.env

export const MAIL_FROM =  `noreply@${APP_HOSTNAME}`

console.log(Number(SMTP_PORT))

console.log(SMTP_PORT)

export const SMTP_OPTIONS: Options = {
   
    host: SMTP_HOST,
    port: +SMTP_PORT,
    auth: {
        pass: SMTP_PASSWORD,
        user: SMTP_USER
    }
}


console.log(SMTP_OPTIONS)