import {Schema, model} from 'mongoose'

const collection = 'carritos'

const cartsSchema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'productos',
            required: true
        },
        quantity:{
            type: Number,
            required: true
        }
    }]
})

cartsSchema.pre('findOne', function(){
    this.populate('products.product')
})

const cartsModel = model(collection, cartsSchema)

export default { cartsModel };