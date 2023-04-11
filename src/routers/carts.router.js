import { Router } from "express";
import CartManager from "../DAO/cartsManager.js";

const routerCar = Router();
const carts = new CartManager();

routerCar.get("/:cid", async (req, res) => {
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

routerCar.post("/", async (req, res) => {
  try {
    // Obtenemos el body
    const cart = req.body;
    console.log(cart);
    // Comprobamos que todos los campos estén completos
    const campoVacio = Object.values(cart).find((value) => value === "");
    console.log(campoVacio);
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

routerCar.post("/:cid/product/:pid", async (req, res) => {
  try {
    let { producto } = req.body;
    const { cid, pid } = req.params;

    producto["idProduct"] = Number(pid);

    const carrito = await carts.getCartById(cid);
    if (carrito.error) return res.status(400).send({ carrito });

    let productoEncontrado = carrito.productos.findIndex(
      (productos) => productos.idProduct == pid
    );
    // console.log(productoEncontrado, 'encontrado')
    // console.log(carrito.productos[0]);
    if (productoEncontrado !== -1) {
      // carrito.productos[productoEncontrado]
      carrito.productos[productoEncontrado].cantidad =
        Number(carrito.productos[productoEncontrado].cantidad) +
        Number(producto.cantidad);
      console.log(carrito.productos);
      await carts.updateCart(cid, carrito);
      return res
        .status(200)
        .send({ statusbar: "success", message: "producto agregado" });
    }
    console.log(producto);
    carrito.productos.push(producto);
    console.log(carrito.productos);
    await carts.updateCart(cid, carrito);
    res.status(200).send({
      status: "success",
      message: "producto agregado",
      carrito: carrito.productos,
    });
  } catch (err) {
    return res
      .status(400)
      .send({ status: "error", message: "error de parametros" });
  }
});

export default routerCar;