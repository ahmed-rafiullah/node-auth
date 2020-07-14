### A simple nodejs app demoing some basic session and security features

[![Generic badge](https://img.shields.io/badge/Looking_for_job-Hire_me-green.svg?style=for-the-badge)](https://shields.io/) ![license](https://img.shields.io/npm/l/m) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

This project was inspired and based on the project [node-auth](https://github.com/alex996/presentations/blob/master/node-auth.md) by that showcases a way to implement  auth  features.

For more information on auth processes visit [https://github.com/alex996/presentations/blob/master/auth.md](https://github.com/alex996/presentations/blob/master/auth.md) and watch the accompanying video [Authentication on the Web (Sessions, Cookies, JWT, localStorage, and more)](https://www.youtube.com/watch?v=2PPSXonhIck)

#### Features

- [x] login/logout/register + session expiry
- [x] email verification (`"Confirm your email"`)
- [x] password reset (`"Forgot password"`)
- [x] password confirmation (`"Re-enter your password"`)
- [x] persistent login (`"Remember me"`)
- [x] account lockout (`"Too many failed login attempts"`)
- [x] rate limiting (`"Too many requests"`)

#### Issues
If you find any security related or other issues please do start a pull request

#### Requirements
Install `node.js` and `Docker`

#### Steps to run

Below is a sample configuration file create a `.env` file in the root of the project and simply copy paste the example below or from the example.env file.

**DO NOT**: leave `SESSION_REMEMBER_ME_MAX_AGE` `SESSION_MAX_AGE` as empty `KEY=` this will still be picked up by dotenv as a null or empty value and will cause cookie code to not work correctly so either provide the complete key value pair or just comment it out. Default values for many env variables are hardcoded in the server config.


    ################################## server variables ##################################

    # optional default value is '3000' in server config
    APP_PORT=3000

    # optional default value is 'development' in server config
    NODE_ENV=development

    # optional default value is 'localhost' in server config
    APP_HOSTNAME=localhost

    # optional default value is 'http' in server config
    APP_PROTOCOL=http

    ################################## security related variables ##################################

    # optional default value is 12 in server config
    SALT_ROUNDS=12

    # optional default value is 'example' in server config
    COOKIE_SECRET=example

    # optional  default value is 'okgr8' in server config
    APP_SECRET=okgr8

    # optional default value is 30 minutes converted to milliseconds in server config
    # the maximum age of a session for a user
    # unit is always milliseconds
    # SESSION_MAX_AGE=

    # optional default value is one week converted to milliseconds in server config
    # the maximum age of a session when a user ticks the remember me checkbox
    # unit is always milliseconds
    # SESSION_REMEMBER_ME_MAX_AGE=

    # optional default value is 'sid' in server config
    SESSION_NAME=sid

    # optional  default value is '5 minutes' converted to milliseconds in server config
    # the maximum age of a password reset link
    # unit is always milliseconds
    # PASSWORD_RESET_TIMEOUT=

    # optional default value is '1 minute' converted to milliseconds in server config
    # the maximum time after which on protected routes the app will ask a user for their password to contnue
    # used for sensitive account settings etc.
    # unit is always milliseconds
    # CONFIRM_PASSWORD_TIME=

    ################################## mailer related variables ##################################

    # you change the variables here according to the mailer service you choose

    # optional default value is smtp.ethereal.email in server config
    SMTP_HOST=smtp.ethereal.email

    # optional default value is smtp.ethereal.email in server config
    SMTP_PORT=587

    # required there is no default in server config
    # get your mail and password from ehtereal mail
    SMTP_USER=<ADD YOUR EMAIL HERE>

    # required there is no default in server config
    SMTP_PASSWORD=<ADD YOUR EMAIL PASSWORD HERE>

    # optional default value is 5m in server config
    # the amount of time after which the email verficiation link will be invalid
    # expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d"
    # https://github.com/vercel/ms
    EMAIL_VERIFICATION_EXPIRY_TIME=5m

    ################################### mysql db variables ###################################

    # optional default value is 'simple' in compose file and server config
    DATABASE_NAME=simple

    # optional default value is 'localhost' in server config
    DATABASE_HOST=localhost

    # optional default value is 'example' in compose file and server config
    DATABASE_PASSWORD=example

    # optional default value is 'root' in compose file and server config
    DATABASE_USER=root

    # optional default value is '4050' in compose file and server config
    DATABASE_PORT=4050

    ################################### mongo variables ###################################

    # optional default value is 'session-cache'  in compose file and server config
    MONGO_DB_NAME=mongo-cache

    # optional default value is 27017  in compose file and server config
    MONGO_PORT=27017

    # optional default value is 0.5 gb  in compose file and server config
    MONGO_CACHE_SIZE=0.5

    # optional default value is localhost in  server config
    MONGO_HOST=localhost

    # optional default value is 'root'  in compose file and server config
    MONGO_INITDB_ROOT_USERNAME=root

    # optional default value is 'example'  in compose file and server config
    MONGO_INITDB_ROOT_PASSWORD=example

Then run `npm install` in the root of project

Next (assuming docker is installed and running) run `npm run up`

After the containers are running run `npm run dev` or `npm run dev`

Provided is a sample postman api for testing

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/e9500291045a3c996a5d)


**SIDE NOTE :** for passwords a schemavalidator is set such that `password must contain at least one upper case letter, one lower case letter, one digit, one special character from _ or -, and have min length 8 and any ascii letter`
