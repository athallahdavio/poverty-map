const express = require("express");
const Province = require("../models/Province");
const ProvinceCoordinate = require("../models/ProvinceCoordinate");
const router = express.Router();

// Get all provinces
router.get("/", async (req, res) => {
  try {
    const provinces = await Province.find();
    res.json(provinces);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new province
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const province = new Province({ name });
    await province.save();
    res.status(201).json(province);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
