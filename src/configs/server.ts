

export const {
    NODE_ENV = 'development',
    APP_SECRET = 'okgr8',
    APP_HOSTNAME = 'localhost',
    APP_PROTOCOL = 'http' ,
    APP_PORT = 3000

} = process.env


export const APP_ORIGIN = `${APP_PROTOCOL}://${APP_HOSTNAME}:${APP_PORT}`

