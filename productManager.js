const fs = require("fs")

class ProductManager {
    constructor() {
        this.products = []
        this.path = "./database/productos.json"
    }

    appendProduct = async () => {
        const toJSON = JSON.stringify(this.products, null, 2);
        await fs.promises.writeFile(this.path, toJSON)
    };

    addProducts = (title, description, price, thumbnail, code, stock) => {
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        
        /* ID AUTOINCREMENTABLE */

        if (this.products.length === 0) {
            product.id = 1 
        } else product.id = this.products [this.products.length - 1].id + 1
    }


    addProduct(newProduct){

        /* Validaciones */
        if (!newProduct.title || 
            !newProduct.description || 
            !newProduct.price || 
            !newProduct.thumbnail || 
            !newProduct.code || 
            !newProduct.stock) return `Todos los campos son obligatorios`

            let product = this.products.find(prod => prod.code === newProduct.code)
            if (product) return `Ya existe un producto con este codigo`

        return this.products.push({id: this.products.length+1, ...newProduct}) &&
        this.appendProduct()
    }

    getProducts = async () => {
        try {
        const productosDb = await fs.promises.readFile(this.path, "utf-8");
        console.log(productosDb);
        } catch (err) {
        console.log(err);
        }
    };

    getProductById = async (idProduct) => {
        try {
        const productosDb = await fs.promises.readFile(this.path, "utf-8");
        const productoId = JSON.parse(productosDb);
        const find = productoId.find((value) => value.id === idProduct);
        return console.log(
            find ? find : "No se encontró un producto con el ID proporcionado"
        );
        } catch (err) {
        console.log(err);
        }
    };

updateProduct = async (id, obj) => {
    try {
    const productosDb = await fs.promises.readFile(this.path, "utf-8");
    const productoId = JSON.parse(productosDb);

    const productoUpdt = Object.assign(productoId[id - 1], obj);
    console.log(productoUpdt);
    this.products = productoId;
    this.appendProduct();
    } catch (err) {
    console.log(err);
    }
};

deleteProduct = async (id) => {
    try {
    const productosDb = await fs.promises.readFile(this.path, "utf-8");
    const productoId = JSON.parse(productosDb);

    productoId.splice(id - 1, 1);
    this.products = productoId;
    this.appendProduct();
    } catch (err) {
    console.log(err);
    }
};

}

const product = new ProductManager ()

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

console.log(product.addProduct({
    title:`Ford F150`,
    description:`Cero kilómetros, versión F150 LARIAT`,
    price: 70000,
    thumbnail: `https://acroadtrip.blob.core.windows.net/catalogo-imagenes/s/RT_V_c0403804a1054bf5964f31dccff67a10.jpg`,
    code: `A003`,
    stock: 2
})) */

/* console.log(product.getProducts()); */
/* console.log(product.getProductById(4)); */


product.getProductById(1)
/* product.updateProduct(2, {price: 45000}) */
/* product.deleteProduct(2) */