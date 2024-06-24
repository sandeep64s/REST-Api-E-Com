//Manage Routes to UserController
import jwtAuth from "../../middlewares/jwt.middleware.js";

//1. Import Express.
import express from "express";
import UserController from "./user.controller.js";

//2. Initialize Express in router;
const userRouter = express.Router();

const userController = new UserController();

//All the parts to controller methods.
//localhost/api/users
userRouter.post("/signup", (req, res,next) => {
  userController.signUp(req, res,next);
});
userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res);
});

userRouter.put("/resetPassword",jwtAuth, (req, res) => {
  userController.resetPassword(req, res);
});

export default userRouter;
