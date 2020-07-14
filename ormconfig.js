


import {DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD , DATABASE_USER, DATABASE_PORT} from './src/configs'



module.exports = 
{
    type: "mysql",
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    synchronize: true,
    logging: true,
    migrationsTableName: 'migrations',
    entities: [
        "src/entities/**/*.ts"
     ],
     migrations: [
        "src/migrations/**/*.ts"
     ],

    
}