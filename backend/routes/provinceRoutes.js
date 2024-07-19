const express = require("express");
const { getAllProvinces, createProvince } = require("../controllers/provinceController");

const router = express.Router();

router.get("/", getAllProvinces);
router.post("/", createProvince);

module.exports = router;