//Backend\models\Wallpaper.js
const mongoose = require("mongoose");

const wallpaperSchema = new mongoose.Schema({
  title: String,
  url: String,
  language: String
});

module.exports = mongoose.model("Wallpaper", wallpaperSchema);
