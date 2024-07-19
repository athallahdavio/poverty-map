const express = require("express");
const { getAllRegencies, createRegency } = require("../controllers/regencyController");

const router = express.Router();

router.get("/", getAllRegencies);
router.post("/", createRegency);

module.exports = router;