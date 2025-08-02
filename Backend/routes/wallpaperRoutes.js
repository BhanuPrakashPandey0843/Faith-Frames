const express = require("express");
const router = express.Router();
const { getAllWallpapers } = require("../controllers/wallpaperController");

router.get("/", getAllWallpapers);

module.exports = router;
