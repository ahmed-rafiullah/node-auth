

const {
    DATABASE_HOST = 'localhost',
    DATABASE_USER = 'root',
    DATABASE_PASSWORD = '12345',
    DATABASE_NAME = 'simple'

} = process.env





module.exports = 
{
    type: "mysql",
    host: DATABASE_HOST,
    port: 4050,
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