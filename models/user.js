const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    email: { type: String, unique: true },
    isAdmin: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: true },
    profile: {
      name: String,
      bio: String,
      phone: String,
      photo: String,
    },
  });
  
  module.exports = mongoose.model("User", userSchema);