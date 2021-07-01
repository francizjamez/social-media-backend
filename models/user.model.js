const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  user_name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  followings: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
  followers: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
});

const userModel = new mongoose.model("user", userSchema);

module.exports = userModel;
