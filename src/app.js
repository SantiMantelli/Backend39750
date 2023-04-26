import express from "express";
import productRouter from "../src/routers/products.router.js";
import routerCart from "./routers/carts.router.js";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import handlebars from 'express-handlebars';
import ProductManager from './DAO/productManager.js';
import {Server} from 'socket.io';


const pm = new ProductManager();


const app = express()

const httpServer = app.listen(8080, () => {
    
    console.log('Escuchando el puerto 8080');
});

const socketServer = new Server(httpServer)

app.use('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {})
})

socketServer.on('connection', async socket => {
    const data =  await pm.getProducts()

/*     socket.emit('products', {data, style: 'index.css'}) */

    socket.emit('products', {data})

    socket.on('product', async data => {
        try{
            const {
            title,
            description,
            price,
            status,
            category,
            thumbnail,
            code,
            stock
        } = data

        const valueReturned = await pm.addProduct(title, description, price, status, category, thumbnail, code, stock)
        console.log(valueReturned)
        }
        catch (err){
            console.log(err);
        }
        
})
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//  HBS
app.engine('handlebars', handlebars.engine()) // Con esto iniciamos nuestro motor de plantillas
app.set('views', __dirname+'/views') // Con esto decimos donde buscar las plantillas
app.set('view engine', 'handlebars') 



// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', (req, res) => {
    res.render('home', {})
})


// Router de carritos
app.use("/api/carts", routerCart);

// Router de productos
app.use("/api/products", productRouter);


