const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  poster: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
  liked_by: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
});

module.exports = postModel = new mongoose.model("post", postSchema);
