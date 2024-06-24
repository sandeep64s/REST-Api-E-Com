import "./env.js";

//1. Import Express
import express from "express";
import swagger from "swagger-ui-express";
import cors from "cors";
import mongoose from "mongoose";

import { connectToMongoDB } from "./src/config/mongodb.js";
import productRouter from "./src/features/product/product.routes.js";
import UserRouter from "./src/features/user/user.routes.js";
import cartRouter from "./src/features/cartItems/cartItems.routes.js";
import orderRouter from "./src/features/order/order.routes.js";
import likeRouter from "./src/features/like/like.routes.js";
import bodyParser from "body-parser";
// import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import apiDocs from "./swagger.json" assert { type: "json" };
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { logger } from "./src/middlewares/logger.middleware.js";
import {
  ApplicationError,
  errorHandlerMiddleware,
} from "./src/error-handler/applicationError.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";

//2. Create Server
var corsOptions = {
  origin: "http://localhost:5500",
};
const server = express();

//CORS Policy configuration
server.use(cors(corsOptions));

// server.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5500");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Access-Control-Allow-Methods", "*");
//   //return ok for preflight request
//   if (req.method == "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

server.use(bodyParser.json());

// for all requests related to product, redirect to product routes.
//localhost:3200/api/products
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

server.use(loggerMiddleware);
// server.use(logger);

server.use("/api/products", jwtAuth, productRouter);
server.use("/api/users", UserRouter);
server.use("/api/cart", jwtAuth, cartRouter);
server.use("/api/orders", jwtAuth, orderRouter);
server.use("/api/likes",jwtAuth,likeRouter)

//3. Default request handler
server.get("/", (req, res) => {
  res.send("Welcome to Ecommerce APIs");
});

//Error handler middleware
server.use((err, req, res, next) => {
  console.log("Inside server.error");
  //User defined error
  if (err instanceof mongoose.Error.ValidationError) {
    console.log("Error handler in server.js" + err.message);
    return res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  } else {
    //server errors
    res.status(500).send("Something went wrong, please try later");
  }
});

//4. Middleware to handle 404 request
server.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found. Please check our documentation for more information at localhost:3200/api-docs"
    );
});

server.use(errorHandlerMiddleware);

//5. Specify Port
server.listen(3200, () => {
  console.log("Server is running at PORT 3200");
  connectUsingMongoose();
});
