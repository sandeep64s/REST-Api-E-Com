import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";

//creating model from schema
const UserModel = mongoose.model("Users", userSchema);

export default class UserRepository {
  async signUp(user) {
    try {
      //Create instance of model
      console.log("signUp");
      const newUser = new UserModel(user);
      console.log("1. Inside user.repository signup_try");
      await newUser.save();
      console.log("2. Inside user.repository signup_try");
      return newUser;
    } catch (err) {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        console.log("Inside user.repository signup_catch_if");
        throw err;
      } else {
        console.log(err);
      }
    }
  }

  async signIn(email, password) {
    try {
      console.log("1. Inside signin");
      await UserModel.findOne({ email, password });
    } catch (err) {}
  }
  async findByEmail(email) {
    try {
      //Find the document.
      console.log("3. findByEmail");
      return await UserModel.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }
  async resetPassword(userId, newPassword) {
    try {
      let user = await UserModel.findById(userId);
      if (user) {
        user.password = newPassword;
        await user.save();
      } else {
        console.log("User not found");
      }
    } catch (err) {
      console.log("Error in resetPassword Repository");
    }
  }
}
