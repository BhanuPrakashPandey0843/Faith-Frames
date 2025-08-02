// Backend\controllers\wallpaperController.js
const Wallpaper = require("../models/Wallpaper");

const getAllWallpapers = async (req, res) => {
  try {
    const wallpapers = await Wallpaper.find();
    res.status(200).json(wallpapers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllWallpapers,
};
