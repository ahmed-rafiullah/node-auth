import { Router } from "express";
import {
  registerSchema,
  loginSchema,
  emailVerificationSchema,
  jwtEmailVerificationSchema,
  resendEmailSchema
} from "./validation";
import { getRepository } from "typeorm";
import { User } from "../../entities/User";
import { logIn, logOut, shouldBeLoggedIn } from "../../middlewares";
import { isAlreadyLoggedIn } from "../../middlewares";
import jsonwebtoken from "jsonwebtoken";

import { BadRequest, UnAuthorizedRequest } from "../../errors/badRequest";
import { sendMail, verifyMailTemplate } from "../../utils";
import { APP_SECRET } from "../../configs";

const route = Router();

route.get("/home", shouldBeLoggedIn, async (req, res, next) => {
  console.log(req.session!.userID);

  const user = await getRepository(User).findOne({ id: req.session!.userID });
  console.log(user);
  res.json({
    user,
  });
});

route.post("/register", isAlreadyLoggedIn, async (req, res, next) => {
  try {
    console.log(req.body);
    const validEmail = await registerSchema.validate(req.body).catch((err) => {
      throw new BadRequest(err.message);
    });

    // check if user exists or not
    const found = await getRepository(User).findOne({
      email: validEmail!.email,
    });
    console.log(found);

    if (found) {
      throw new BadRequest("invalid email");
    }

    // insert user into db
    const user = new User();
    user.firstName = validEmail!.firstName;
    user.lastName = validEmail!.lastName;
    user.email = validEmail!.email;
    user.password = validEmail!.password;

    const result = await getRepository(User).save(user);

    console.log(result);

    const resetURL = await result.createResetURL();

    console.log(user.id);

    sendMail({
      to: "alize.herman@ethereal.email",
      subject: "Verify your email address",
      html: verifyMailTemplate(resetURL),
    });

    // logIn(req, result.id)

    res.json({
      message:
        "registered successfully and a verification email has been sent to your email address",
    });
  } catch (err) {
    next(err);
  }
});

route.post("/login", isAlreadyLoggedIn, async (req, res, next) => {
  try {
    console.log(req.body);
    const validLogin = await loginSchema.validate(req.body).catch((err) => {
      throw new BadRequest(err.message);
    });

    // check if user exists or not
    const foundUser = await getRepository(User).findOne(
      { email: validLogin!.email },
      { select: ["id", "password", "email", "activatedAt"] }
    );
    console.log(foundUser);

    // no email or password not correct
    if (
      !foundUser ||
      !(await foundUser.matchesPassword(validLogin!.password))
    ) {
      throw new UnAuthorizedRequest("email or password incorrect");
    }

    if (!foundUser.activatedAt) {
      throw new UnAuthorizedRequest(
        "you need to verify your email first or resend if you haven't received it"
      );
    }

    //user login credentials are correct
    logIn(req, foundUser.id);

    res.json({
      message: "logged in user",
      user: {
        id: foundUser.id,
        email: foundUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

route.post("/logout", shouldBeLoggedIn, async (req, res, next) => {
  try {
    await logOut(req, res);

    res.json({
      message: "logged out",
    });
  } catch (err) {
    next(err);
  }
});

route.post("/email/verify", isAlreadyLoggedIn, async (req, res, next) => {
  // do the thing and set activated to now
  try {
    // validate query params
    const validToken = await emailVerificationSchema.validate(req.query)

    // check decode token or fail if invalid
    let result = null
    try {
       result =  jsonwebtoken.verify(validToken!.token, APP_SECRET)
    }  catch (err) {
        throw new BadRequest('Invalid token')
    }

    console.log(result)
   
    // check if id is there
    const validID = await jwtEmailVerificationSchema.validate(result);

    // check if user exists
    const found = await getRepository(User).findOne({ id: validID!.id });

    if (!found) {
      throw new BadRequest("invalid email");
    }

    if (found.activatedAt) {
      throw new BadRequest("email already active");
    }

    // update activated at
    await getRepository(User).update(validID!.id, {activatedAt: new Date()})

    

    // login the user
    logIn(req, validID!.id)

    res.json({
      message: "email verified and you have been logged in automatically",
    });
  } catch (err) {
    next(err);
  }
});


route.post("/email/resend", async (req, res, next) => {
  // do the thing and set activated to now
  try {
    // validate query params
    const validEmail = await resendEmailSchema.validate(req.body);


    // check if user exists
    // always select id over here
    const found = await getRepository(User).findOne({ email: validEmail!.email });
    console.log(found)
    // if user exists and email is not already verified then send the mail
    if(!found?.activatedAt) {
      console.log('email found and unactive')
      const resetURL = await found!.createResetURL();

   
  
      sendMail({
        to: "alize.herman@ethereal.email",
        subject: "Verify your email address",
        html: verifyMailTemplate(resetURL),
      });

     
      
    } else{
      console.log('email already active')
    }
   
    // give generic response for security

    res.json({
      message: "If your email address needs to be verified, you will receive an email with the activation link",
    });
  } catch (err) {
    next(err);
  }
});


export default route;
