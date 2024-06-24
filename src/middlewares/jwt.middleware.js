import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  console.log(req.headers);

  //1. Read the token
  const token = req.headers["authorization"];

  //2. If no token, return the error
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  //3. check if token if valid
  try {
    const payload = jwt.verify(token, "hZ>rL4-JY*z3IOwYkFxG");
    req.userId=payload.userId;
    console.log(payload);
  } catch (err) {
    //4. return error
    return res.status(401).send("Unauthorized");
  }

  //5. call next middleware
  next();
};

export default jwtAuth;
