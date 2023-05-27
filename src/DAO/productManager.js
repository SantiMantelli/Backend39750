import { Console } from "console";
import fs from "fs";
import prodModel from "../DAO/models/products.model.js";

const prModel = prodModel.productsModel;

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
    const validarCodigo = await prModel.find({ code: { $eq: product.code } });
    if (validarCodigo.length !== 0) {
      return {
        status: "error",
        message: "El producto no se pudo agregar porque el codigo es repetido",
      };
    }

    const newProduct = new prModel({
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

  getProducts = async (filter, options) => {
    try {
        return await prModel.paginate(filter, options);

    } catch (err) {
        return err
    }
}

  
getProductById = async (id) => {
  try {
    let product = await prModel.findById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  } catch (err) {
    console.log(err);
    throw new Error("Error al obtener el producto");
  }
};

  
  

  updateProduct = async (pid, data) => {

    const validarCodigo = await prModel.findById(pid);
    if (validarCodigo.length === 0) {
      return {
        status: "error",
        message: "El producto no existe",
      };
    }

    try {
      const updatedProduct = await prModel.updateOne(
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
      const deletedProduct = await prModel.deleteOne({ _id: pid });
      console.log(deletedProduct); 
    } catch (err) {
      console.log(err);
    }
  };

  categories = async () => {
    try {
        const categories = await prModel.aggregate([
            {
                $group: {
                    _id: null,
                    categories: { $addToSet: "$category" }
                }
            }
        ])

        return categories[0].categories

    }
    catch (err) {
        console.log(err);
        return err
    }

}

}

/* const product = new ProductManager(); */


export default ProductManager