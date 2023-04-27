import { Router } from "express";
import ProductManager from "../DAO/productManager.js";
import uploader from "../utils/multer.utils.js";

const router = Router();
const pm = new ProductManager();

//  GET  //

router.get("/", async (req, res) => {
  // http://localhost:8080/products?limit=2
  const { limit } = req.query;
  try {
    if (isNaN(Number(limit)) && limit)
    return res.status(400).send({ status: "No es un numero valido" });
    const valueReturned = await pm.getProducts();
    if (valueReturned.error)
      return res.status(200).send({ status: "Sin productos", valueReturned });
    const limitProducts = valueReturned.slice(0, limit);
    res.render("products", { limitProducts }); // Renderizar la vista "home" y pasarle los datos "limitProducts"
  } catch (err) {
    res.status(400).send({ status: "error router", err });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    // http://localhost:8080/products/2
    console.log(req.params.pid);
    const product = await pm.getProductById(req.params.pid);
    res.status(200).send({ product });
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
    console.log(valueReturned);
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



export default router;