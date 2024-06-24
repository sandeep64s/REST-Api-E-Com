import { logger } from "../middlewares/logger.middleware.js";


export class ApplicationError extends Error{
    constructor(message,code){
        super(message);
        this.code=code;
    }
}

export const errorHandlerMiddleware = (err, req, res, next) => {
    // Write your code here
    const errorMessage =
      err.message || "Oops! Something went wrong... Please try again later!";
    const statusCode = err.statusCode || 500;
  
    logger.error({
      level: "error",
      timestamp: new Date().toString(),
      requestURL: req.originalURL,
      errorMessage: errorMessage,
    });
    res.status(statusCode).json({ error: errorMessage });
  };
  