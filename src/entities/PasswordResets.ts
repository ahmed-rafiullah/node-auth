import {Entity,Column, PrimaryGeneratedColumn,BeforeInsert,ManyToOne ,CreateDateColumn, UpdateDateColumn} from 'typeorm'

import {bcryptOptions, PASSWORD_RESET_BYTES,APP_ORIGIN, APP_SECRET,EMAIL_VERIFICATION_EXPIRY_TIME} from '../configs'

import { User } from './User'
import { randomBytes, createHmac,timingSafeEqual } from 'crypto'


@Entity('passwordResets')
export class PasswordResets {

    @PrimaryGeneratedColumn('uuid')
    resetID: string
    
    @ManyToOne(type => User)
    user: User


    @Column('text')
    token: string


    @Column('datetime')
    expiresAt: Date


    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date


    //  always hash token before inserting to db
    @BeforeInsert()
    encryptToken = () => {
        console.log('before insert called')
        const hashedToken = this.hashToken(this.token)
        this.token = hashedToken
        
    }

    // create a secure random token
    createToken = () => {
        return randomBytes(PASSWORD_RESET_BYTES).toString('hex')
    }

    validateToken = (plainTextToken: string) => {
        const hash = this.hashToken(plainTextToken)
        return timingSafeEqual(Buffer.from(hash), Buffer.from(this.token)) &&
          this.expiresAt > new Date()
    }


     createPasswordResetUrl =  (plainTextToken: string) => {
        return `${APP_ORIGIN}/user/password/reset?id=${this.resetID}&token=${plainTextToken}`
    }

    // hash secure random token
    hashToken = (plainTextToken: string) => {
        return createHmac('sha256', APP_SECRET).update(plainTextToken).digest('hex')

    }

}