import {Entity,Column, PrimaryGeneratedColumn,BeforeInsert, CreateDateColumn, UpdateDateColumn} from 'typeorm'
import bcrypt from 'bcrypt'
import {bcryptOptions, APP_ORIGIN, APP_SECRET,EMAIL_VERIFICATION_EXPIRY_TIME} from '../configs'
import jsonwebtoken from 'jsonwebtoken'


interface IUser{
    id?: string,
    firstName: string,
    lastName: string,
    email: string
    password:string
    createdAt: Date
    updatedAt: Date

}

@Entity("users")
export class User implements IUser {

    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column({length: 100})
    firstName: string;

    @Column({length: 100})
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column({length: 100, select: false})
    password: string;

    @Column({nullable:true,default: null})
    activatedAt: Date


    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
    

    @BeforeInsert()
    encryptPassword = async () => {
        const hashedPassword = await bcrypt.hash(this.password, bcryptOptions.SALT_ROUNDS)
        this.password = hashedPassword
        
    }


    async matchesPassword(password: string){
        return await bcrypt.compare(password, this.password)

    }


   async createResetURL() {
        // sign a token
        const token = await jsonwebtoken.sign({
            id: this.id
        }, APP_SECRET, {
            expiresIn: EMAIL_VERIFICATION_EXPIRY_TIME
        })

        // create a url
        const url = `${APP_ORIGIN}/user/email/verify/?token=${token}`

        console.log(url)
        
        return url

   }

   async validateURL(url: string) {

    // extract token from url


    // decode it


    // return id if valid else throw
   
    return url

}



}