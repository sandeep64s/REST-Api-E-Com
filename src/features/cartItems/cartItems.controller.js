import CartItemModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.respository.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export class CartItemController {
  constructor() {
    this.cartItemsRepository = new CartItemsRepository();
  }
  async add(req, res) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.userId;
      await this.cartItemsRepository.add(productId, userId, quantity);
      res.status(201).send("Cart is updated");
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }
  async get(req, res) {
    try {
      const userId = req.userId;
      const items = await this.cartItemsRepository.get(userId);
      res.status(200).send(items);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }
  async delete(req, res) {
    try {
      const userId = req.userId;
      const cartItemId = req.params.id;
      const isDeleted = CartItemModel.delete(cartItemId, userId);
      if (!isDeleted) {
        res.status(404).send("Item not found");
      } else {
        res.status(200).send("Cart Item deleted");
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }
}
