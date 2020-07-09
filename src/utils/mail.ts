import  nodemailer, {SendMailOptions} from 'nodemailer'
import { SMTP_OPTIONS, MAIL_FROM,  } from '../configs/'

const transporter = nodemailer.createTransport(SMTP_OPTIONS)

export function sendMail(options: SendMailOptions) {

    transporter.sendMail({
        ...options,
        from: MAIL_FROM
    })

}



 export function verifyMailTemplate (link: string) {
     return `
     <p>Please click the button below to verify your email address.</p>
    
     <a href="${link}">Verify Email</a>

     or the link below

     <br/>     <br/>

     <a href="${link}">${link}</a>
     
     <p>If you did not create an account, no further action is required.</p>
     
     `
 }