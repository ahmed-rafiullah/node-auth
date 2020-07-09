import {Options} from 'nodemailer/lib/smtp-connection'
import { APP_HOSTNAME } from './server'

export const {
    SMTP_HOST = 'smtp.ethereal.email',
    SMTP_PORT = 587,
    SMTP_USER = 'alize.herman@ethereal.email',
    SMTP_PASSWORD = 'pX6FXz6tUrdzNkEmGm'

} = process.env

export const MAIL_FROM =  `noreply@${APP_HOSTNAME}`

export const EMAIL_VERIFICATION_EXPIRY_TIME = '5m'

export const SMTP_OPTIONS: Options = {
   
    host: SMTP_HOST,
    port: +SMTP_PORT,
    auth: {
        pass: SMTP_PASSWORD,
        user: SMTP_USER
    }
}