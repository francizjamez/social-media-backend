const mongoose = require("mongoose");

const refreshTokenSchema = mongoose.Schema({
  token: { type: String, required: true },
  user: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
});

module.exports = refreshTokenModel = new mongoose.model(
  "refresh_token",
  refreshTokenSchema
);
