import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this._id = id;
  }

  static getAll() {
    return users;
  }
}

let users = [
  {
    id: "1",
    name: "Admin User",
    email: "seller@gmail.com",
    password: "password",
    type: "seller",
  },
  {
    id: "2",
    name: "Customer User",
    email: "customer@gmail.com",
    password: "password",
    type: "customer",
  },
];
