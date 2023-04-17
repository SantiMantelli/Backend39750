import express from "express";
import productRouter from "../src/routers/products.router.js";
import routerCart from "./routers/carts.router.js";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});


// Router de carritos
app.use("/api/carts", routerCart);

// Router de productos
app.use("/api/products", productRouter);

app.listen(8080, () => {
console.log("Escuchando el 8080");
});
