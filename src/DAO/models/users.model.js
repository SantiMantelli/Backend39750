/// esquema 
import {Schema, model} from 'mongoose'

const collection = 'usuarios'

const userSchema = new Schema({// nomnre 
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
    gender: String
})

const userModel = model(collection, userSchema)

module.exports = {
    userModel
}