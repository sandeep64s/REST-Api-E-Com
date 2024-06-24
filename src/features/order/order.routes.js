//Manage Routes to OrderController

//1. Import Express.
import express from "express";
import OrderController from "./order.controller..js";

//2. Initialize Express in router;
const orderRouter = express.Router();

const orderController = new OrderController();

console.log("I am order.routes");

orderRouter.post("/", (req, res, next) => {
  orderController.placeOrder(req, res, next);
});

export default orderRouter;
