import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB, getClient } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    const client = getClient();
    const session = client.startSession();
    try {
      const db = getDB();
      session.startTransaction();

      //1. Get cartitems and calculate total amount.
      const items = await this.getTotalAmount(userId, session);
      const finalTotalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      console.log(finalTotalAmount);

      //2. Create an order record.
      const newOrder = new OrderModel(
        new ObjectId(userId),
        finalTotalAmount,
        new Date()
      );
      await db.collection(this.collection).insertOne(newOrder, { session });

      //3. Reduce stock.
      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productId },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }
      console.log("Hiii");
      // throw new Error("Something is wrong in placeHolder");

      //4. Clear the cart items.
      await db.collection("cartItems").deleteMany(
        {
          userId: new ObjectId(userId),
        },
        { session }
      );
      session.commitTransaction();
      session.endSession();
      console.log("End of session");
      return;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }

  async getTotalAmount(userId, session) {
    const db = getDB();
    const collection = db.collection("cartItems");
    const items = await collection
      .aggregate(
        [
          //1. Get cart Items from the user
          {
            $match: { userId: new ObjectId(userId) },
          },
          //2. Get the products from products collection
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          //3. Unwind the productInfo
          {
            $unwind: "$productInfo",
          },
          //4. Calculate total amount for each cart items
          {
            $addFields: {
              totalAmount: {
                $multiply: ["$productInfo.price", "$quantity"],
              },
            },
          },
        ],
        { session }
      )
      .toArray();
    return items;
  } 
}
