import mongoose,{Schema} from 'mongoose'


// https://stackoverflow.com/questions/5794834/how-to-access-a-preexisting-collection-with-mongoose


//  schemaless
const sessionSchema = new Schema({
   
    //https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id
    _id: String
    
})

// third argument connects the schema to an existing collection
export const Sessions = mongoose.model('Session',sessionSchema,'sessions')






