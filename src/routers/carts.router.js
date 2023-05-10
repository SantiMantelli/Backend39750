import { Router } from "express";
import CartManager from "../DAO/cartsManager.js";

const routerCart = Router();
const carts = new CartManager();

routerCart.get("/", async (req, res) => {
  try {
    const valueReturned = await carts.getCarts();
    if (valueReturned.error)
      return res.status(200).send({ status: "Sin carritos", valueReturned });

    res.status(200).send({ status: "Carritos", valueReturned });
  } catch (err) {
    res.status(400).send({ status: "error router", err });
  }
});



routerCart.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const valueReturned = await carts.getCartById(cid);
    if (valueReturned.error)
      return res.status(200).send({ status: "Sin carritos", valueReturned });

    res.status(200).send({ status: "Carrito", valueReturned });
  } catch (err) {
    res.status(400).send({ status: "error router", err });
  }
});

routerCart.post("/", async (req, res) => {
  try {
    const cart = req.body.products;
    console.log(req.body.products)
    const newCart = await carts.addCart(cart);
    res.status(200).send({ newCart });
  } catch (err) {
    console.log(err);
  }
});

/* Codigo para agregar un nuevo carrito */

/* fetch('http://localhost:8080/api/carts/', {
  method: 'POST',
  body: JSON.stringify({
    products:[
      {
        "product": '6457ffd9574b5c9a0b143e35',
        "quantity": 5
      },
      {
        "product": '6457ffd9574b5c9a0b143e3b',
        "quantity": 9
      }
    ],
      
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log) */

routerCart.post("/:cid/product/:pid/cantidad/:qt", async (req, res) => {
  try {
    const { cid, pid, qt } = req.params;
    const updatedCart = await carts.updateCart(cid, pid, qt);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: 'No se pudo actualizar el carrito', error });
  }

});

/* Codigo para sumar cantidad de un producto a tal carrito */

/* fetch('http://localhost:8080/api/carts/645acd18ce804bd514e4c6dc/product/6457ffd9574b5c9a0b143e3b/cantidad/10', {
  method: 'POST',

  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log) */

export default routerCart;