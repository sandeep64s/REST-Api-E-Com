import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import { logger } from "../../middlewares/logger.middleware.js";
import { errorHandlerMiddleware } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async signUp(req, res, next) {
    try {
      const { name, email, password, type } = req.body;

      //Hash Password
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new UserModel(name, email, hashedPassword, type);
      await this.userRepository.signUp(user);
      res.status(201).send(user);
    } catch (err) {
      console.log("Inside controller"+err.message);
      next(err);
      console.log(err);
      // return res.status(400).send("Something went wrong in Signup");
    }
  }

  async signIn(req, res) {
    try {
      //1. Find user by email
      const user = await this.userRepository.findByEmail(req.body.email);
      console.log("2. Inside SignIn Controller");
      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        console.log("3. Inside SignIn Controller else");
        //2. Compare password with hashed password.
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          console.log
          //3. Create token
          const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          //4. Send token.
          return res.status(200).send(token);
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (err) {
      console.log(err);
      errorHandlerMiddleware(err, req, res);

      // const errorMessage =
      //   err.message || "Oops! Something went wrong... Please try again later!";
      // const statusCode = err.statusCode || 500;

      // logger.error({
      //   level: "error",
      //   timestamp: new Date().toString(),
      //   requestURL: req.originalURL,
      //   errorMessage: errorMessage,
      // });
      // return res.status(statusCode).json({ error: errorMessage });

      // return res.status(503).send("Something went wrong");
    }
  }
  async resetPassword(req, res, next) {
    const { newPassword } = req.body;
    const userId = req.userId;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    try {
      await this.userRepository.resetPassword(userId, hashedPassword);
      res.status(200).send("Password is reset");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error in resetPassword Controller");
    }
  }
}
