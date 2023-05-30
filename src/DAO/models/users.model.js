import {Schema, model} from 'mongoose'

const collection = 'usuarios'

const userSchema = new Schema({
    first_name: {
        type: String,
        index: true
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String, 
    role:{
        type: String,
        enum: ['user']
    }
})

const userModel = model(collection, userSchema)

export default { userModel };