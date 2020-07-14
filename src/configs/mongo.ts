

export const {
    MONGO_PORT = 27017 ,
    MONGO_INITDB_ROOT_USERNAME = 'root' ,
    MONGO_INITDB_ROOT_PASSWORD = 'example',
    MONGO_HOST = 'localhost',
    MONGO_DB_NAME = 'session-cache'

}  = process.env


// example uri  'mongodb://root:example@localhost:27017/session/?authSource=admin'

export const mongoOptions = {
    url: `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/?authSource=admin`,
    other: {dbName: MONGO_DB_NAME , useNewUrlParser: true, useUnifiedTopology: true}
}


