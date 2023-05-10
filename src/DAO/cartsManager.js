import fs from "fs";
import cm from "../DAO/models/carts.model.js";

class CartManager {
  constructor() {
    this.carts = [];
    this.path = "./DAO/carts.json";
  }

  addCart = async (newCart) => {
    try {
      const cart = new cm.cartsModel({products: newCart });
      const savedCart = await cart.save();
      return savedCart;
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

  updateCart = async (cid, pid, qt) => {
    try {
      const existingCart = await cm.cartsModel.findById(cid);
      if (existingCart) {
        // Busca si el producto ya está en el carrito
        const productIndex = existingCart.products.findIndex(
          (p) => p.product._id.toString() === pid
        );
        if (productIndex !== -1) {
          // Si el producto ya está en el carrito, actualiza la cantidad
          existingCart.products[productIndex].quantity = parseInt(existingCart.products[productIndex].quantity) + parseInt(qt);
        } else {
          // Si el producto no está en el carrito, agrégalo
          existingCart.products.push({ product: pid, qt });
        }
        const updatedCart = await existingCart.save();
        return updatedCart;
      } else {
        return 'No se encontro el id del carrito'
      }
    } catch (error) {
      return { status: "error", error: err };
    }

  };
}

/* const carritos = new CartManager(); */


export default CartManager;