import express from "express";
import productRouter from "../src/routers/products.router.js";
import routerCart from "./routers/carts.router.js";

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static", express.static("./src/public"));

// Router de carritos
app.use("/api/carts", routerCart);

// Router de productos
app.use("/api/products", productRouter);

app.listen(8080, () => {
console.log("Sintonizando 8080");
});
