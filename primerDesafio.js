class ProductManager {
    constructor() {
        this.products = []
    }
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

        return this.products.push({id: this.products.length+1, ...newProduct})
    }

    getProducts(){
        return this.products
    }

    getProductById(id){
        let product = this.products.find(prod => prod.id === id)
        if (!product) return `Producto inexistente`
        return product
    }

}

const product = new ProductManager ()

product.addProduct({
    title:`Toyota Hilux`,
    description:`Descripcion de la toyota`,
    price: 45000,
    thumbnail: `link img`,
    code: `A001`,
    stock: 5
})

product.addProduct({
    title:`Toyota Corolla`,
    description:`Descripcion del Corolla`,
    price: 30000,
    thumbnail: `link img`,
    code: `A002`,
    stock: 7
})

console.log(product.addProduct({
    title:`Ford F150`,
    description:`Descripcion de la F150`,
    price: 70000,
    thumbnail: `link img`,
    code: `A003`,
    stock: 2
}))

console.log(product.getProducts());
/* console.log(product.getProductById(4)); */

