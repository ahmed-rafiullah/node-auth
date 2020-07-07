import { Router } from "express";
import { registerSchema, loginSchema } from "./validation";
import {getManager, getConnection, getRepository } from 'typeorm'
import { User } from "../../entities/User";
import { logIn, logOut, shouldBeLoggedIn } from "../../middlewares";
import { isAlreadyLoggedIn } from '../../middlewares'
import { nextTick } from "process";
import { BadRequest, UnAuthorizedRequest } from "../../errors/badRequest";
import {validate} from '../../utils'





const route = Router();

route.post("/register", isAlreadyLoggedIn ,async (req, res, next) => {
  try {

    console.log(req.body)
    const validEmail = await registerSchema.validate(req.body).catch(err => {
      throw new BadRequest(err.message)
    })

   
    
    // check if user exists or not
    const found = await getRepository(User).findOne({email: validEmail!.email })
    console.log(found)

    if(found) {
       throw new BadRequest('email exists')
    }

    // insert user into db
    const user = new User()
    user.firstName = validEmail!.firstName
    user.lastName = validEmail!.lastName
    user.email = validEmail!.email
    user.password = validEmail!.password
    


    const result = await getRepository(User).save(user)

    console.log(result)

    
    console.log(user.id)

    logIn(req, result.id)

    res.json({
      message: 'inserted user',
      user: {
          id: result.id,
          email: validEmail!.email
          
      }
    });
  } catch (err) {next(err)}
});

route.post("/login",  isAlreadyLoggedIn , async (req, res, next) => {
  try {

    console.log(req.body)
    const validLogin = await loginSchema.validate(req.body).catch(err => {
      throw new BadRequest(err.message)
    })

   
    
    // check if user exists or not
    const foundUser = await getRepository(User).findOne({email: validLogin!.email  }, {select: ['id', 'password', 'email']})
    console.log(foundUser)

   
    // no email or password not correct
    if(!foundUser || !(await foundUser.matchesPassword(validLogin!.password))) {
       throw new UnAuthorizedRequest('email or password incorrect')
    }



    //user login credentials are correct
    logIn(req, foundUser.id)

    res.json({
      message: 'logged in user',
      user: {
         id: foundUser.id,
         email : foundUser.email
          
      }
    });
  } catch (err) {next(err)}
});

route.post("/logout",  shouldBeLoggedIn  ,async (req, res, next) => {
  try {
    await logOut(req,res)
    
    res.json({
      message: 'logged out'
    })
  } catch (err) {next(err)}
});

export default route;
