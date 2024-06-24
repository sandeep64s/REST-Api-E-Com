import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    match: [/.+\@.+\../, "PLease enter a valid email"],
  },
  password: {
    type: String,
    // validate: {
    //   validator: function (value) {
    //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(
    //       value
    //     );
    //   },
    //   message:
    //     "Password should be between 8 to 12 characters and have a special character",
    // },
  },
  type: { type: String, enum: ["customer", "seller"] },
});
