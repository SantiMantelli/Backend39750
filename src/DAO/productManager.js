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
    description,
    price,
    status,
    category,
    thumbnail,
    code,
    stock
  ) => {
    const productsFS = await this.getProducts();
    // console.log(productsFS);
    this.products = productsFS;

    const product = {
      title,
      description,
      price,
      status,
      category,
      thumbnail,
      code,
      stock,
    };
    // console.log(product, 'codigo----');
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
      console.log(product.price, "precio");
      product.price = Number(product.price);
      product.stock = Number(product.stock);
      product.thumbnail = [product.thumbnail];
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
      const parseProducst = JSON.parse(getFileProducts);
      console.log(parseProducst[id - 1]);
      if (!parseProducst[id - 1]) return "Error! No existe";

      return parseProducst[id - 1];
    } catch (err) {
      console.log(err);
    }
  };

  updateProduct = async (pid, data) => {
    const getFileProducts = await fs.promises.readFile(this.path, "utf-8");
    const parseProducts = JSON.parse(getFileProducts);
    // console.log(parseProducts);
    if (isNaN(Number(pid)))
      return { status: "error", message: "No es un id válido" };

    const findId = parseProducts.findIndex((product) => product.id == pid);
    if (findId === -1)
      return { status: "error", message: "No se encontró el id" };

    this.products = parseProducts.map((element) => {
      if (element.id == pid) {
        element = Object.assign(element, data);
        return element;
      }
      return element;
    });

    this.__appendProduct();
    return returnedTarget;
  };

  deleteProduct = async (pid) => {
    const getFileProducts = await fs.promises.readFile(this.path, "utf-8");
    const parseProducts = JSON.parse(getFileProducts);
    if (isNaN(Number(pid)))
      return { status: "error", message: "No es un id válido" };

    const findId = parseProducts.findIndex((product) => product.id == pid);
    if (findId === -1)
      return { status: "error", message: "No se encontró el id" };

    this.products = parseProducts.filter((product) => product.id !== pid);

    this.appendProduct();
    return {
      status: "success",
      message: `Se eliminó el producto con id ${pid}`,
    };
  };
}

const product = new ProductManager();

/* product.addProduct({
    title:`Toyota Hilux`,
    description:`Cero kilómetros, versión SRX, caja automática.`,
    price: 45000,
    thumbnail: `https://acroadtrip.blob.core.windows.net/catalogo-imagenes/xl/RT_V_5f4024782d854ab3a56779e286268878.webp`,
    code: `A001`,
    stock: 5
})

product.addProduct({
    title:`Toyota Corolla`,
    description:`Año 2022, 12.000 kilómetros, versión SEG CVT`,
    price: 30000,
    thumbnail: `https://media.toyota.com.ar/12d01c73-22b1-4025-8612-13f06bb8923d.png`,
    code: `A002`,
    stock: 7
})

product.addProduct({
    title:`Ford F150`,
    description:`Cero kilómetros, versión F150 LARIAT`,
    price: 70000,
    thumbnail: `https://acroadtrip.blob.core.windows.net/catalogo-imagenes/s/RT_V_c0403804a1054bf5964f31dccff67a10.jpg`,
    code: `A003`,
    stock: 2
}); */

/* console.log(product.getProducts()); */
/* console.log(product.getProductById(4)); */


/* product.getProductById(1) */
/* product.updateProduct(2, {price: 45000}) */
/* product.deleteProduct(2) */



export default ProductManager