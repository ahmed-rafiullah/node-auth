import {Entity,Column, PrimaryGeneratedColumn,BeforeInsert, CreateDateColumn, UpdateDateColumn} from 'typeorm'
import bcrypt from 'bcrypt'
import {bcryptOptions} from '../configs'
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



}