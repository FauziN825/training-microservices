const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
    },
    accountNumber: {
      type: Number,
      unique: true,
    },
    identityNumber: {
      type: Number,
      unique: true,
    },
  },
  { timestamps: true }
);

const UserData = mongoose.model("users", userSchema);
module.exports = UserData;
