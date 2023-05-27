import fs from "fs";
import cm from "../DAO/models/carts.model.js";

const cModel = cm.cartsModel;

class CartManager {
  constructor() {
    this.carts = [];
    this.path = "./DAO/carts.json";
  }

  addCart = async (newCart) => {
    try {
      const cart = new cModel({products: newCart });
      const savedCart = await cart.save();
      return savedCart;
    } catch (err) {
      console.log(err);
    }
  };


  getCarts = async () => {
    try {
      const carts = await cModel.find().lean()
      if (carts.length === 0) return 'Carritos inexistentes';
      return carts
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  getCartById = async (id) => {
    try {
      let product = await cModel.findById(id);
      if (!product) {
        throw new Error("Carrito no encontrado");
      }
      return product;
    } catch (err) {
      console.log(err);
      throw new Error("Error al obtener el carrito");
    }
  };

  updateCart = async (cid, pid, qt) => {
    try {
      const existingCart = await cModel.findById(cid);
      console.log(qt)
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
          existingCart.products.push({ product: pid, quantity:qt });
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

  deleteProductInCart = async (cid, products) => {
    try {
        return await cModel.findOneAndUpdate(
            { _id: cid },
            { products },
            { new: true })

    } catch (err) {
        return err
    }

}

deleteAllProductsInCart = async (cid) => {
  try {
    return await cModel.findOneAndUpdate(
      { _id: cid },
      { products: [] },
      { new: true }
    );
  } catch (err) {
    return err;
  }
};



}

/* const carritos = new CartManager(); */


export default CartManager;