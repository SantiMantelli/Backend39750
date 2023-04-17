import { Console } from "console";
import fs from "fs";

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "./DAO/productos.json";
  }

  __appendProduct = async () => {
    const toJSON = JSON.stringify(this.products, null, 2);
    await fs.promises.writeFile(this.path, toJSON);
  };

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
    const productsFS = await this.getProducts();
    /*console.log(productsFS); */
    this.products = productsFS;

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
    const validarCodigo = this.products.find(
      (productos) => productos.code === product.code
    );
    if (validarCodigo) {
      return {
        status: "error",
        message: "El producto no se pudo agregar porque el codigo es repetido",
      };
    }
    // ID Autoincremental
    if (this.products.length === 0) {
      product.id = 1;
    } else {
      product.id = this.products[this.products.length - 1].id + 1;
    }

    // Verifica que el objeto tenga todos sus valores

    if (Object.values(product).every((value) => value)) {
      product.status === "false"
        ? (product.status = false)
        : (product.status = true);
      product.price = Number(product.price);
      product.stock = Number(product.stock);
      this.products.push(product);
      this.__appendProduct();
      return {
        status: "succes",
        message: "El producto se registró",
        producto: product,
      };
    }
    return { status: "error", message: "Todos los campos son obligatorios" };
  };

  getProducts = async () => {
    try {
      const getFileProducts = await fs.promises.readFile(this.path, "utf-8");
      if (getFileProducts.length === 0) return [];
      return JSON.parse(getFileProducts);
    } catch (err) {
      console.log(err);
      return { status: "error", error: err };
    }
  };

  getProductById = async (id) => {
    try {
      const getFileProducts = await fs.promises.readFile(this.path, "utf-8");
      const parseProducts = JSON.parse(getFileProducts);
      const product = parseProducts.find((product) => product.id == id);
      if (!product) return "Error! No existe";
      return product;
    } catch (err) {
      console.log(err);
    }
  };
  

  updateProduct = async (pid, data) => {
    const getFileProducts = await fs.promises.readFile(this.path, "utf-8");
    const parseProducts = JSON.parse(getFileProducts);
    /* console.log(parseProducts); */
    if (isNaN(Number(pid)))
      return { status: "error", message: "No es un id válido" };

      const findId = parseProducts.findIndex((product) => product.id == pid);
      if (findId === -1)
        return { status: "error", message: "No se encontró el id" };
        
    this.products = parseProducts.map((product) => {
      if (product.id == pid) {
        product = Object.assign(product, data);
        return product;
      }
      return product;
    });
    
    this.__appendProduct();
    return {
      status: "success",
      message: `Se actualizo el producto con id ${pid}`,
    };
  };

  deleteProduct = async (pid) => {
    const getFileProducts = await fs.promises.readFile(this.path, "utf-8");
    const parseProducts = JSON.parse(getFileProducts);
  
    if (isNaN(Number(pid))) {
      return { status: "error", message: "No es un id válido" };
    }
  
    const productIndex = parseProducts.findIndex((product) => product.id == pid);
  
    if (productIndex !== -1) {
      // Si se encuentra el producto, eliminarlo del array
      parseProducts.splice(productIndex, 1);
      this.products = parseProducts; // Actualizar la lista de productos
    } else {
      return { status: "error", message: "No se encontró el id" };
    }

    this.__appendProduct();
    return {
      status: "success",
      message: `Se eliminó el producto con id ${pid}`,
    };
  };
}

/* const product = new ProductManager(); */


export default ProductManager