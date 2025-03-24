const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  name: String,
  image: String, // Stores Base64 string
});

module.exports = mongoose.model("Image", ImageSchema);