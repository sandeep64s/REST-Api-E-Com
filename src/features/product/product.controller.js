import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
import { errorHandlerMiddleware } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async addProduct(req, res) {
    try {
      const { name, desc, price, category, sizes } = req.body;
      const newProduct = new ProductModel(
        name,
        desc,
        parseFloat(price),
        req?.file?.filename,
        category,
        sizes?.split(",")
      );
      // name, desc, price, imageUrl, category, sizes,id
      const createdRecord = await this.productRepository.add(newProduct);
      res.status(201).send(createdRecord);
    } catch (err) {
      errorHandlerMiddleware(err, req, res);
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      if (!product) {
        res.status(404).send("Product not found");
      } else {
        return res.status(200).send(product);
      }
      res.status(200).send(product);
    } catch (err) {
      errorHandlerMiddleware(err, req, res);
    }
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      console.log(err);
      errorHandlerMiddleware(err, req, res);
    }
  }

  async rateProducts(req, res) {
    try {
      const userId = req.userId;
      const productId = req.body.productId;
      const rating = req.body.rating;
      await this.productRepository.rateProduct(userId, productId, rating);
      return res.status(200).send("Rating has been added");
    } catch (err) {
      console.log(err);
      errorHandlerMiddleware(err, req, res);
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const category = req.query.category;
      const result = await this.productRepository.filter(
        minPrice,
        maxPrice,
        category
      );
      return res.status(200).send(result);
    } catch (err) {
      errorHandlerMiddleware(err, req, res);
    }
  }

  async averagePrice(req, res, next) {
    try {
      const result = await this.productRepository.averageProductPerCategory();
      res.status(200).send(result);
    } catch (err) {
      errorHandlerMiddleware(err, req, res);
    }
  }
}
