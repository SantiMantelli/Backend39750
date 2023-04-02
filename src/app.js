import ProductManager from './productManager.js';
import express from 'express';

const app = express()
const PORT = 8080

/* const products = new Container('../database/productos.json') */

const productManager = new ProductManager();

app.use(express.urlencoded({ extended: true }))

const server = app.listen(PORT, () => {
    console.log(`Sintonizando radio ${server.address().port}`)
});

server.on('error', (error) => {
    console.log('Error', error)
});

app.get("/products", async (req, res) => {
    try {
        const products = await productManager.getProducts()
        const limit =  req.query.limit
        if(!limit) return res.send(products)
        res.send(products.slice(0, limit)) 

    } catch (error) {
        console.log(error);
    }
}) 

app.get("/products/:pid", async (req, res) => {
    try {
        const id = parseInt(req.params.pid)
        const product = await productManager.getProductById(id)
        if(!product) res.send('PRODUCT NOT FOUND')
        res.send(product)
    } catch (error) {
        console.log(error);
    }
})