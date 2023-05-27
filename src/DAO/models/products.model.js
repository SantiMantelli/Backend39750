import {Schema, model} from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
const collection = 'productos'

const productsSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    status:{
        type: String

    },
    thumbnail:{
        type: String
    },
    code:{
        type: String,
        required: true,
        unique: true
    },
    stock:{
        type: Number,
        required: true
    },
})

productsSchema.plugin(mongoosePaginate)

const productsModel = model(collection, productsSchema)


export default { productsModel };