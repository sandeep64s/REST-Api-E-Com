import { likeSchema } from "./like.schema.js";
import mongoose from "mongoose";


const LikeModel = mongoose.model("Like", likeSchema);

export class LikeRepository {
  async getLikes(id, type) {
    return await LikeModel.find({
      likeable: new ObjectId(id),
      types: type,
    })
      .populate("user")
      .populate({ path: "likeable", model: type });
  }

  async likeProduct(userId, productId) {
    try {
      const newLike = new LikeModel({
        user: new isObjectIdOrHexString(userId),
        likeable: new isObjectId(productId),
        types: "Product",
      });
      await newLike.save();
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
  async likeCategory(userId, categoryId) {
    try {
      const newLike = new LikeModel({
        user: new ObjectId(userId),
        likeable: new ObjectId(categoryId),
        types: "Category",
      });
      await newLike.save();
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
}
