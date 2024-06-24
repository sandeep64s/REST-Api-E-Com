//Manage Routes to ProductController

//1. Import Express.
import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileupload.middleware.js";

//2. Initialize Express in router;
const productRouter = express.Router();

const productController = new ProductController();

console.log("I am product.routes");

//All the parts to controller methods.
//localhost/api/products
//localhost:3200/api/filter?minPrice=10&maxPrice=20&category=category1

productRouter.post("/", upload.single("imageUrl"), (req, res) => {
  productController.addProduct(req, res);
});

productRouter.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});

productRouter.get("/filter", (req, res) => {
  productController.filterProducts(req, res);
});

productRouter.post("/rate", (req, res) => {
  productController.rateProducts(req, res);
});
productRouter.get("/averagePrice", (req, res, next) => {
  productController.averagePrice(req, res);
});
productRouter.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});

export default productRouter;
