import { LikeRepository } from "./like.repository.js";
import { likeSchema } from "./like.schema.js";
import mongoose from "mongoose";

export class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }
  async likeItem(req, res, next) {
    try {
      const { id, type } = req.body;
      const userId = req.userId;
      if (type != "Product" && type != "Category") {
        return res.status(400).send("Invalid type");
      }
      if ((type = "Product")) {
        this.likeRepository.likeProduct(userId, id);
      } else {
        this.likeRepository.likeCategory(userId, id);
      }
      return res.status(200).send();
    } catch (err) {
      return res.status(200).send("Something went wrong");
    }
  }

  async getLikes(req, res, next) {
    try {
      const { id, type } = req.query;
      const likes = await this.likeRepository.getLikes(id, type);
      return res.status(200).send(likes);
    } catch (err) {
      return res.status(200).send("Something went wrong");
    }
  }
}
