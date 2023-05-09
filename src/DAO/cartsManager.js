import fs from "fs";
import cm from "../DAO/models/carts.model.js";

class CartManager {
  constructor() {
    this.carts = [];
    this.path = "./DAO/carts.json";
  }
  __appendCart = async () => {
    const toJSON = JSON.stringify(this.carts, null, 2);
    await fs.promises.writeFile(this.path, toJSON);
  };

  addCart = async (newCart) => {
    try {
      const carts = await this.getCarts();
      // console.log(carts);
      this.carts = carts;

      //ID autoincremental
      if (this.carts.length === 0) {
        newCart.id = 1;
      } else {
        newCart.id = this.carts[this.carts.length - 1].id + 1;
      }

      if (Object.values(newCart).every((value) => value)) {
        this.carts.push(newCart);
        const toJSON = JSON.stringify(this.carts, null, 2);
        await fs.promises.writeFile(this.path, toJSON);
      }

      return [];
    } catch (err) {
      console.log(err);
    }
  };


  getCarts = async () => {
    try {
      const carts = await cm.cartsModel.find().lean()
      if (carts.length === 0) return 'Carritos inexistentes';
      return carts
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  getCartById = async (id) => {
    try {
      const carts = await cm.cartsModel.findById(id)
      if (carts.length === 0) return 'El carrito no existe';
      return carts
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  updateCart = async (cid, productId, quantity) => {
try {
  const cart = await cm.cartsModel.findById(cid);
  if (cart.length === 0) {
    return {
      status: "error",
      message: "El carrito no existe",
    };
  }

  cart.products.push({ product: productId, quantity: quantity });
  
  // Guarda los cambios en la base de datos
  await cart.save();

  return cart;

} catch (error) {
  return res
      .status(400)
      .send({ status: "error", message: "error de parametros" });
}

  };
}

/* const carritos = new CartManager(); */


export default CartManager;