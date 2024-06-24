import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likeable: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "types",
  },
  types: {
    type: String,
    enum: ["Product", "Category"],
  },
})
  .pre("save", (next) => {
    console.log("New Like coming in");
    next();
  })
  .post("save", (next) => {
    console.log("Like is saved");
    console.log(doc);
  })
  .pre("find", (doc) => {
    console.log("Retrieving Likes");
    next();
  })
  .post("find", (docs) => {
    console.log("Find is completed");
    console.log(docs);
  });
