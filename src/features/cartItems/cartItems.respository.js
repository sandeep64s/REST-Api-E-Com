import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";

export default class CartItemsRepository {
  constructor() {
    this.collection = "cartItems";
  }
  async add(productId, userId, quantity) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const id = await this.getNextCounter(db);
      //find the document
      //either insert or update
      await collection.updateOne(
        {
          productId: new ObjectId(productId),
          userId: new ObjectId(userId),
        },
        {
          $setOnInsert: { _id: id },
          $inc: {
            quantity: quantity,
          },
        },
        { upsert: true }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }
  async get(productId, userId, quantity) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      await collection.find({ userId: new ObjectId(userId) }).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }
  async delete(cartItemId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await collection.deleteOne({
        cartItemId: new ObjectId(cartItemId),
        userId: new ObjectId(userId),
      });
      return result.deletedCount > 0;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }
  async getNextCounter(db) {
    const resultDocument = await db
      .collection("counter")
      .findOneAndUpdate(
        { _id: "cartItemId" },
        { $inc: { value: 1 } },
        { returnDocument: "after" }
      );
    console.log(resultDocument);
    return resultDocument.value.value;
  }
}
