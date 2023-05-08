import { Console } from "console";
import fs from "fs";
import prodModel from "../DAO/models/products.model.js";

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "./DAO/productos.json";
  }

  addProduct = async (
      title,
      category,
      description,
      price,
      status,
      thumbnail,
      code,
      stock,
  ) => {

    const product = {
      title,
      category,
      description,
      price,
      status,
      thumbnail,
      code,
      stock,
    };

    // Validacion de codigo
    const validarCodigo = await prodModel.productsModel.find({ code: { $eq: product.code } });
    if (validarCodigo.length !== 0) {
      return {
        status: "error",
        message: "El producto no se pudo agregar porque el codigo es repetido",
      };
    }

    const newProduct = new prodModel.productsModel({
      title: product.title,
      category:product.category,
      description:product.description,
      price:product.price,
      code:product.code,
      stock:product.stock,
    });
    
    try {
      const savedProduct = await newProduct.save();
      return {
        status: "succes",
        message: "El producto se registró",
        producto: savedProduct,
      };
    } catch (err) {
      console.log(err);
    }
    
    
  };

  getProducts = async () => {
    try {
        let products = await prodModel.productsModel.find().lean()
      if (products.length === 0) return [];
      return products;
    } catch (err) {
      console.log(err);
      return { status: "error", error: err };
    }
  };

  getProductById = async (id) => {
    /* http://localhost:8080/api/products/6457ffd9574b5c9a0b143e3c */
    try {
      let products = await prodModel.productsModel.findById(id);
      if (!products) return [];
      return products;
    } catch (err) {
      console.log(err);
      return { status: "error", error: err };
    }
  };
  
  

  updateProduct = async (pid, data) => {

    const validarCodigo = await prodModel.productsModel.findById(pid);
    if (validarCodigo.length === 0) {
      return {
        status: "error",
        message: "El producto no existe",
      };
    }

    try {
      const updatedProduct = await prodModel.productsModel.updateOne(
        { _id: pid },
        { $set: {title:data.title,
          category:data.category,
          description:data.description,
          price:data.price,
          code:data.code,
          stock:data.stock}}
      );
      return {
        status: "succes",
        message: "El producto se actualizo",
        producto: updatedProduct,
      };
    } catch (err) {
      console.log(err);
    }

    
  };

  deleteProduct = async (pid) => {
    try {
      const deletedProduct = await prodModel.productsModel.deleteOne({ _id: pid });
      console.log(deletedProduct); 
    } catch (err) {
      console.log(err);
    }
  };
}

/* const product = new ProductManager(); */


export default ProductManager