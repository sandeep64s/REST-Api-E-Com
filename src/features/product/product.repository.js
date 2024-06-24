import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import mongoose from "mongoose";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Categories", categorySchema);

class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  async add(product) {
    try {
      //1. Add the product.
      product.categories = product.category.split(",").map((e) => e.trim());
      console.log(product);
      const newProduct = new ProductModel(product);
      const savedProduct = await newProduct.save();

      //2. Update the categories
      await CategoryModel.updateMany(
        { _id: { $in: product.categories } },
        {
          $push: { products: new ObjectId(savedProduct._id) },
        }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }

  async getAll() {
    try {
      //1. Get the database
      const db = getDB();

      //2. Get collection
      const collection = db.collection(this.collection);

      //3. Find the document.
      const products = await collection.find().toArray();
      //   console.log(products);
      return products;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }

  async get(id) {
    try {
      //1. Get the database
      const db = getDB();

      //2. Get collection
      const collection = db.collection(this.collection);

      //3. Find the document.
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }

  //Product should have min price specified and category
  async filter(minPrice, maxPrice, category) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
      }
      //['Cart1','Cart2]
      // categories=JSON.parse(categories.replace(/'/g,'"'))
      // if(categories){
      //   filterExpression={$and:[{category:{$in:categories}},filterExpression]}
      // }
      if (category) {
        // filterExpression={$and:[{category:category},filterExpression]}
        filterExpression.category = category;
      }
      const products = await collection
        .find(filterExpression)
        .project({ _id: 0, name: 1, price: 1, ratings: { slice: -2 } })
        .toArray();
      console.log(products);
      return products;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }

  async rateProduct(userId, productId, rating) {
    try {
      // const db = getDB();
      // const collection = db.collection(this.collection);

      // //1. Remove if existing entry
      // await collection.updateOne(
      //   {
      //     _id: new ObjectId(productId),
      //   },
      //   {
      //     $pull: { ratings: { userId: new ObjectId(userId) } },
      //   }
      // );

      // //2. Add new Entry
      // await collection.updateOne(
      //   {
      //     _id: new ObjectId(productId),
      //     "ratings.userId": new ObjectId(userId),
      //   },
      //   {
      //     $set: {
      //       "ratings.$.rating": rating,
      //     },
      //   }
      // );

      //1. Check if product exists
      const productToUpdate = await ProductModel.findById(productId);
      if (!productToUpdate) {
        throw new Error("Error not found");
      }
      //2. Get the existing review
      const userReview = await ReviewModel.findOne({
        product: new ObjectId(productId),
        user: new ObjectId(userId),
      });
      if (userReview) {
        userReview.rating = rating;
        await userReview.save();
      } else {
        const newReview = new ReviewModel({
          product: new ObjectId(productId),
          user: new ObjectId(userId),
          rating: rating,
        });
        newReview.save();
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }
  // async rateProduct(userId, productId, rating) {
  //   try {
  //     const db = getDB();
  //     const collection = db.collection(this.collection);
  //     //1. Find the product
  //     const product = await collection.findOne({
  //       _id: new ObjectId(productId),
  //     });
  //     //2. Find the rating
  //     const userRating = product?.rating?.find((r) => r.userId == userId);
  //     if (userRating) {
  //       //3. Update the rating
  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productId),
  //           "ratings.userId": new ObjectId(userId),
  //         },
  //         {
  //           $set: {
  //             "ratings.$.rating": rating,
  //           },
  //         }
  //       );
  //     } else {
  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productId),
  //         },
  //         {
  //           $push: {
  //             ratings: { _id: new ObjectId(userId), rating },
  //           },
  //         }
  //       );
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationError("Something went wrong with database", 503);
  //   }
  // }

  async averageProductPerCategory() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection
        .aggregate([
          //Stage 1 : Get average price per category
          {
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }
  async getNextCounter(db) {
    const resultDocument = await db
      .collection("counter")
      .findOneAndUpdate(
        { _id: "productId" },
        { $inc: { value: 1 } },
        { returnDocument: "after" }
      );
    console.log(resultDocument);
    return resultDocument.value.value;
  }
}

export default ProductRepository;
