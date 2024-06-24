//1. Import Express.
import express from "express";
import { CartItemController } from "./cartItems.controller.js";

//2. Initialize Express in router;
const cartRouter = express.Router();

const cartItemController = new CartItemController();

//All the parts to controller methods.
//localhost/api/products
//localhost:3200/api/cart
cartRouter.post("/", (req, res) => {
  cartItemController.add(req, res);
});
cartRouter.get("/", (req, res) => {
  cartItemController.get(req, res);
});
cartRouter.delete("/:id", (req, res) => {
  cartItemController.delete(req, res);
});

export default cartRouter;
