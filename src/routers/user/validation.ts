import * as yup from "yup";

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
const password = yup
  .string()
  .required("password is required")
  .min(8)
  .max(72)
  .trim()
  .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-_]).{8,}$/, passwordRegexMessage)
  .test("byteLength", "length should not be greater than 72", function(value) {
     return Buffer.byteLength(value) <= 72 ? true : false
     
  });
const name = yup.string().required().min(1).max(100).trim();
const confirmPassword = yup
  .string()
  .oneOf([yup.ref("password")], "both passwords need to the same")
  .required("confrim password is required");

export const registerSchema = yup.object().shape({
  email: email,
  password: password,
  firstName: name,
  lastName: name,
  confirmPassword: confirmPassword,
});

export const loginSchema = yup.object().shape({
    email: email,
    password:  yup
    .string()
    .required("password is required")
    .min(8)
    .max(72)
    .trim()
    .test("byteLength", "length should not be greater than 72", function(value) {
        return Buffer.byteLength(value) <= 72 ? true : false
        
     })
   
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

