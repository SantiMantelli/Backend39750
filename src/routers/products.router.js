import { Router } from "express";
import ProductManager from "../DAO/productManager.js";
import uploader from "../utils/multer.utils.js";



const router = Router();
const pm = new ProductManager();

//  GET  //

router.get('/', async (request, response) => {
  try {
      let { limit, page, sort, category } = request.query
      console.log(request.originalUrl);

      const options = {
          page: Number(page) || 1,
          limit: Number(limit) || 10,
          sort: {}
      };

      if (sort === "desc") {
        options.sort.price = -1;
      } else if (sort === "asc") {
        options.sort.price = 1;
      }
      


      const links = (products) => {
          let prevLink;
          let nextLink;
          if (request.originalUrl.includes('page')) {
              prevLink = products.hasPrevPage ? request.originalUrl.replace(`page=${products.page}`, `page=${products.prevPage}`) : null;
              nextLink = products.hasNextPage ? request.originalUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : null;
              return { prevLink, nextLink };
          }
          if (!request.originalUrl.includes('?')) {
              prevLink = products.hasPrevPage ? request.originalUrl.concat(`?page=${products.prevPage}`) : null;
              nextLink = products.hasNextPage ? request.originalUrl.concat(`?page=${products.nextPage}`) : null;
              return { prevLink, nextLink };
          }
          prevLink = products.hasPrevPage ? request.originalUrl.concat(`&page=${products.prevPage}`) : null;
          nextLink = products.hasNextPage ? request.originalUrl.concat(`&page=${products.nextPage}`) : null;
          return { prevLink, nextLink };

      }

      const categories = await pm.categories()

      const result = categories.some(categ => categ === category)
      if (result) {

          const products = await pm.getProducts({ category }, options);
          const { prevLink, nextLink } = links(products);
          const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
          return response.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
      }

      const products = await pm.getProducts({}, options);
      console.log(products)
      const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
      const { prevLink, nextLink } = links(products);
      return response.render('products', { status: 'success', docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink }); 
      /* return response.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink }); */
  } catch (err) {
      console.log(err);
  }
})

router.get("/:pid", async (req, res) => {
  try {
    // http://localhost:8080/products/2
    console.log(req.params.pid);
    const product = await pm.getProductById(req.params.pid);
    if (product.message) return res.status(404).send({ message: `ID: ${req.params.pid} no encontrado` })
    return res.status(200).send({ product });
  } catch (err) {
    console.log(err);
  }
});

//  POST  //

router.post("/formulario", uploader.single("thumbnail"), async (req, res) => {
  try {
    // Obtenemos el body
    const productSend = req.body;

    // desestructuración para enviar al método addProduct
    const { title, category, description, price, code, stock } = productSend;
    const status = req.body.status === undefined ? 'false' : 'true'
    const thumbnail = req.file.path;

    const valueReturned = await pm.addProduct(
      title,
      category,
      description,
      price,
      status,
      thumbnail,
      code,
      stock
    );
    // Si addProduct devuelve un objeto con la propiedad error quiere decir que hay un error
    if (valueReturned.status === "error")
      return res.status(400).send({ valueReturned });
    res.status(200).send({ productSend });
  } catch (err) {
    console.log(err);
  }
});

/* DELETE */

router.delete("/:pid", async (req, res) => {
  try {
    // http://localhost:8080/products/delete/2
    const product = await pm.deleteProduct(req.params.pid);
    res.status(200).send({ product });
  } catch (err) {
    console.log(err);
  }
});


/* UPDATE */

router.put("/:pid", async (req, res) => {
  try {
    // Datos obtenidos desde el cliente
    const { pid } = req.params;
    const productUpdate = req.body;
  /*   console.log(pid, req.body) */
    const updateProduct = await pm.updateProduct(pid, productUpdate);
    if (!updateProduct.error) return res.status(400).send({ updateProduct });
    res.status(200).send({ updateProduct });
  } catch (err) {
    console.log(err);
  }
});

/* Codigo para modificar algun producto */
/* fetch('http://localhost:8080/api/products/6', {
  method: 'PUT',
  body: JSON.stringify({
    title: 'Fiat Cronos',
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log) */

/* Intento para views con paginacion /products */
/* router.get('/products', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // Aquí debes obtener los productos de tu fuente de datos
    const products = await pm.getProducts(page, limit);

    return res.render('products', { products });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
}); */




export default router;