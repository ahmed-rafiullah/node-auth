import * as yup from "yup";
import {PASSWORD_RESET_BYTES} from '../../configs'
import { PasswordResets } from "../../entities/PasswordResets";

const email = yup
  .string()
  .email()
  .required("email is required")
  .min(8)
  .max(100)
  .lowercase()
  .trim();
// TODO: https://youtu.be/A6f1zYX2BCk?t=415
// https://stackoverflow.com/a/19605207
const passwordRegexMessage = 'password must contain at least one upper case letter, one lower case letter, one digit, one special character from _ or -, and have min length 8'

const barePassword = yup
.string()
.required("password is required")
.min(8)
.max(72)
.nullable(false)
.trim()


const password = yup
  .string()
  
  .required("password is required")
  .min(8)
  .max(72)
  .trim()
  
  .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-_]).{8,}$/, passwordRegexMessage)
  .test("byteLength", "length should not be greater than 72", function(value: string) {

     if(value){
       return Buffer.byteLength(value) <= 72 ? true : false
     } 

      return false
  
     
  });

  const passwordWithOutRegex = yup
  .string()
  .required("password is required")
  .min(8)
  .max(72)
  .nullable(false)
  .trim()
  .test("byteLength", "length should not be greater than 72",  function(value: string) {
    if(value){
      return Buffer.byteLength(value) <= 72 ? true : false
    } 

     return false
     
  });
const name = yup.string().required().min(1).max(100).trim();
const confirmPassword = yup
  .string()
  .oneOf([yup.ref("password")], "both passwords need to the same")
  .required("confirm password is required");

export const registerSchema = yup.object().shape({
  email: email,
  password: password,
  firstName: name,
  lastName: name,
  confirmPassword: confirmPassword,
});

export const loginSchema = yup.object().shape({
    email: email,
    password: passwordWithOutRegex
   
  });


  export const emailVerificationSchema = yup.object().shape({
    token: yup.string().required()
  });

  export const jwtEmailVerificationSchema = yup.object().shape({
    id: yup.string().required()
  });


  export const resendEmailSchema = yup.object().shape({
    email: email
  });

  export const passwordForgotSchema = yup.object().shape({
    email: email
  });


  export const passwordResetSchema = yup.object({
    query: yup.object({
      id: yup.string().required(),
      token: yup.string().required()
    }),
    body: yup.object({
      
     
      confirmPassword: confirmPassword,
      password: password,
    
   

    })
  })


  


