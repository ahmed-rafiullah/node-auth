import { Router } from "express";
import mongoose from "mongoose";
import {
  registerSchema,
  loginSchema,
  emailVerificationSchema,
  jwtEmailVerificationSchema,
  resendEmailSchema,
  passwordResetSchema,
  passwordForgotSchema,
  passwordReAuthSchema,
} from "./validation";
import { getRepository, getManager, InsertResult, ObjectID } from "typeorm";
import { User } from "../../entities/User";
import {
  logIn,
  logOut,
  shouldBeLoggedIn,
  reAuthenticate,
} from "../../middlewares";
import { isAlreadyLoggedIn, parseUserAgent } from "../../middlewares";
import jsonwebtoken from "jsonwebtoken";

import { BadRequest, UnAuthorizedRequest } from "../../errors/badRequest";
import {
  sendMail,
  verifyMailTemplate,
  passWordResetMailTemplate,
} from "../../utils";
import { APP_SECRET, PASSWORD_RESET_TIMEOUT } from "../../configs";
import { PasswordResets } from "../../entities/PasswordResets";
import { Sessions } from "../../entities/MongooseSession";

const route = Router();

route.get("/home", shouldBeLoggedIn, async (req, res, next) => {
  console.log(req.session!.userID);

  const user = await getRepository(User).findOne({ id: req.session!.userID });
  console.log(user);
  //@ts-ignore
  console.log(req[Symbol.for("agent")]);
  res.json({
    user,
    //@ts-ignore
    agent: req[Symbol.for("agent")],
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

route.post(
  "/login",
  isAlreadyLoggedIn,
  parseUserAgent(),
  async (req, res, next) => {
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
      
      logIn(req, foundUser.id, validLogin!.rememberMe);

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
  }
);

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
    const validToken = await emailVerificationSchema.validate(req.query);

    // check decode token or fail if invalid
    let result = null;
    try {
      result = jsonwebtoken.verify(validToken!.token, APP_SECRET);
    } catch (err) {
      throw new BadRequest("Invalid token");
    }

    console.log(result);

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
    await getRepository(User).update(validID!.id, { activatedAt: new Date() });

    // login the user
    logIn(req, validID!.id);

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
    const found = await getRepository(User).findOne({
      email: validEmail!.email,
    });
    console.log(found);
    // if user exists and email is not already verified then send the mail
    if (!found?.activatedAt) {
      console.log("email found and unactive");
      const resetURL = await found!.createResetURL();

      sendMail({
        to: "alize.herman@ethereal.email",
        subject: "Verify your email address",
        html: verifyMailTemplate(resetURL),
      });
    } else {
      console.log("email already active");
    }

    // give generic response for security

    res.json({
      message:
        "If your email address needs to be verified, you will receive an email with the activation link",
    });
  } catch (err) {
    next(err);
  }
});

route.post("/password/forgot", isAlreadyLoggedIn, async (req, res, next) => {
  // do the thing and set activated to now
  try {
    // validate query params
    const validEmail = await passwordForgotSchema.validate(req.body);

    // check if user exists
    // always select id over here
    const found = await getRepository(User).findOne({
      email: validEmail!.email,
    });

    // if user exists then send the mail
    if (found) {
      const passwordReset = new PasswordResets();
      // create the token
      const token = passwordReset.createToken();
      // set the reset token data
      passwordReset.token = token;
      passwordReset.user = found;
      // expires 1 hour from now
      const date = new Date();
      const expiresAt = new Date(date.getSeconds() + PASSWORD_RESET_TIMEOUT);

      passwordReset.expiresAt = expiresAt;

      console.log(passwordReset);

      // https://github.com/AhmedKhattak/presentations/blob/master/node-auth.md#deactivation
      // took the bad ux option since its easier

      // perform transaction

      await getManager().transaction(async (transactionEntityManager) => {
        // delete all current user reset tokens
        await transactionEntityManager
          .getRepository(PasswordResets)
          .delete({ user: found });
        // save to db this will also hash the token
        const res = await transactionEntityManager
          .getRepository(PasswordResets)
          // it adds the id to the in memory passwordReset object before saving it to
          // db so we can access it later after the transaction implicitly !
          .save(passwordReset);

        console.log(res);
      });

      console.log("---------");
      console.log(passwordReset);

      // create a sharable url
      // id will be already present here
      // WARNING:
      // DO NOT move this code to be above the transaction block code
      let url = passwordReset.createPasswordResetUrl(token);

      sendMail({
        to: "alize.herman@ethereal.email",
        subject: "Password Reset",
        html: passWordResetMailTemplate(url),
      });
    }

    // give generic response for security

    res.json({
      message:
        "If you have an account with us, you will receive an email with a link to reset your password",
    });
  } catch (err) {
    next(err);
  }
});

route.post("/password/reset", isAlreadyLoggedIn, async (req, res, next) => {
  try {
    // validate query params and body
    const validPasswordReset = await passwordResetSchema.validate({
      body: req.body,
      query: req.query,
    });

    // check if user exists
    // always select id over here
    const found = await getRepository(PasswordResets).findOne({
      where: { resetID: validPasswordReset!.query!.id },
      relations: ["user"],
    });

    // if no password reset is found or token is invalid or user for token is not found in user table
    if (
      !found ||
      !found.validateToken(validPasswordReset!.query!.token) ||
      !(await getRepository(User).findOne({
        where: { id: found.user.id },
      }))
    ) {
      throw new BadRequest("Invalid Token");
    }

    // reset password and delete all tokens for user

    found.user.password = validPasswordReset!.body!.password;

    await getManager().transaction(async (transactionEntityManager) => {
      // update password
      await transactionEntityManager.getRepository(User).save(found.user);

      // delete all current user reset tokens
      await transactionEntityManager
        .getRepository(PasswordResets)
        .createQueryBuilder()
        .delete()
        .where("user = :id", { id: found.user.id })
        .execute();
    });

    sendMail({
      to: "alize.herman@ethereal.email",
      subject: "Password reset status",
      text: "Your password was successfully reset",
    });

    res.json({
      message: "OK",
    });
  } catch (err) {
    next(err);
  }
});

// should be protected by adding reauthenticateIfIdle middleware
route.get("/settings", shouldBeLoggedIn, reAuthenticate(), (req, res, next) => {
  res.json({
    message: "sensitive settings :O",
  });
});

// password confirm to reset reauthenticate timer
route.post("/password/confirm", shouldBeLoggedIn, async (req, res, next) => {
  try {
    const validatedPassword = await passwordReAuthSchema
      .validate(req.body)
      .catch((err) => {
        throw new BadRequest(err.message);
      });
    // get user for current session
    const userID = req.session!.userID;

    const user = await getRepository(User).findOne(
      { id: userID },
      { select: ["password"] }
    );

    if (user) {
      const result = await user.matchesPassword(validatedPassword!.password);

      if (!result) {
        throw new BadRequest("passwords don't match");
      }

      // reset time
      req.session!.lastLogin = Date.now();

      return res.json({
        message: "password confirmed successfully",
      });
    } else {
      throw new BadRequest("user no longer exists");
    }
  } catch (err) {
    next(err);
  }
});

// logout all sessions other than the current
route.post(
  "/sessions/logout",
  shouldBeLoggedIn,
  reAuthenticate(),
  async (req, res, next) => {
    try {
      // get user for current session
      const userID = req.session!.userID;
      const result = await Sessions.deleteMany({
        "session.userID": userID,
        _id: { $nin: [req.sessionID] },
      });
      res.json({
        message: "logged out from all other sessions",
      });

      // go through redis session store and clear all sessions except this one
    } catch (err) {
      next(err);
    }
  }
);

// list all current sessions of logged in user
route.get("/sessions/", shouldBeLoggedIn, async (req, res, next) => {
  try {
    // get user for current session
    const userID = req.session!.userID;

    const result = await Sessions.find({ "session.userID": userID });
    res.json({
      sessions: result,
    });
  } catch (err) {
    next(err);
  }
});

export default route;
