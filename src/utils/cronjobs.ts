import {CronJob} from 'cron'
import {getRepository} from 'typeorm'
import { PasswordResets } from '../entities/PasswordResets'

const FIVE_MINUTES = '* * * * *'
export const removeExpiredPasswordResetTokens = new CronJob(FIVE_MINUTES, async function() {

    /// DO NOT MESS WITH THIS
   
 

   const res =  await getRepository(PasswordResets)
    .createQueryBuilder()
    .delete()
    .from(PasswordResets)
    .where('expiresAt < :now', { now: new Date() })
    .execute()

    console.log(res)

    
    
    

    
},null,false)









