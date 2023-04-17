import { Router } from "express";
import CartManager from "../DAO/cartsManager.js";

const routerCart = Router();
const carts = new CartManager();

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
    // Obtenemos el body
    const cart = req.body;
    console.log(req.body)
    // Comprobamos que todos los campos estén completos
    const campoVacio = Object.values(cart).find((value) => value === "");
    if (campoVacio) {
      return res
        .status(400)
        .send({ status: "error", message: "Falta completar algún campo" });
    }

    // Si addProduct devuelve un objeto con la propiedad error quiere decir que hay un error
    if (cart.status === "error") return res.status(400).send({ valueReturned });
    await carts.addCart(cart);
    res.status(200).send({ cart });
  } catch (err) {
    console.log(err);
  }
});

/* Codigo para agregar un nuevo carrito */

/* fetch('http://localhost:8080/api/carts/', {
  method: 'POST',
  body: JSON.stringify({
    productos:[
      {
        "idProduct": 8,
        "cantidad": 2
      },
      {
        "idProduct": 6,
        "cantidad": 12
      }
    ],
      
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log) */

routerCart.post("/:cid/product/:pid", async (req, res) => {
  try {
    let producto = {};
    const { cid, pid } = req.params;

    producto["idProduct"] = Number(pid);
    producto["cantidad"] = 1;

    const carrito = await carts.getCartById(cid);
    if (carrito.error) return res.status(400).send({ carrito });

    let productoEncontrado = carrito.productos.findIndex(
      (productos) => productos.idProduct == pid
    );
    console.log(productoEncontrado, 'encontrado')
 
    if (productoEncontrado !== -1) {
      // carrito.productos[productoEncontrado]
      carrito.productos[productoEncontrado].cantidad =
        Number(carrito.productos[productoEncontrado].cantidad) + 1;
      await carts.updateCart(cid, carrito);
      return res
        .status(200)
        .send({ statusbar: "success", message: "producto agregado" });
    }
    carrito.productos.push(producto);
    await carts.updateCart(cid, carrito);
    res.status(200).send({
      status: "success",
      message: "Producto agregado",
      carrito: carrito.productos,
    });
  } catch (err) {
    return res
      .status(400)
      .send({ status: "error", message: "error de parametros" });
  }
});

/* Codigo para agregar un producto a tal carrito */

/* fetch('http://localhost:8080/api/carts/2/product/3', {
  method: 'POST',

  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log) */

export default routerCart;