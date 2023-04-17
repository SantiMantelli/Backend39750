import fs from "fs";

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
      const getFileCarts = await fs.promises.readFile(this.path, "utf-8");
      if (getFileCarts.length === 0) return [];
      return JSON.parse(getFileCarts);
    } catch (err) {
      console.log(err);
      return { status: "error", error: err };
    }
  };

  getCartById = async (id) => {
    try {
      const getFileCarts = await fs.promises.readFile(this.path, "utf-8");
      const parseCarts = JSON.parse(getFileCarts);
      // console.log(parseCarts[id - 1]);
      if (!parseCarts[id - 1]) return { error: "Error! El carrito No existe" };

      return parseCarts[id - 1];
    } catch (err) {
      console.log(err);
    }
  };

  updateCart = async (cid, data) => {
    try {
      const getFileCarts = await fs.promises.readFile(this.path, "utf-8");
      const parseCarts = JSON.parse(getFileCarts);
      if (isNaN(Number(cid)))
        return { status: "error", message: "No es un id válido" };

      const findId = parseCarts.findIndex((cart) => cart.id == cid);
      if (findId === -1)
        return { status: "error", message: "No se encontró el id" };

      this.carts = parseCarts.map((element) => {
        if (element.id == cid) {
          element = Object.assign(element, data);
          return element;
        }
        return element;
      });

      this.__appendCart();
      return {
        status: "success",
        message: `Se actualizo el carrito ${cid}`,
      };
    } catch (err) {
      console.log(err);
    }
  };
}

/* const carritos = new CartManager(); */

/* const test = async () => {
  const carrito = {
    productos: [
      {
        idProduct: 4,
        cantidad: 10,
      },
      {
        idProduct: 2,
        cantidad: 11,
      },
    ],
  };
  await carritos.addCart(carrito);
};
test(); */

export default CartManager;