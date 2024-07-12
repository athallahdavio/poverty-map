const express = require("express");
const RegencyPoverty = require("../models/RegencyPoverty");
const ProvincePoverty = require("../models/ProvincePoverty");
const router = express.Router();

function calculateStdDev(arr) {
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  const squareDiffs = arr.map((val) => Math.pow(val - mean, 2));
  const avgSquareDiff =
    squareDiffs.reduce((acc, val) => acc + val, 0) / arr.length;
  return Math.sqrt(avgSquareDiff);
}

router.get("/", async (req, res) => {
  try {
    const data = await RegencyPoverty.find()
      .populate("province_id")
      .populate("regency_id");
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/option", async (req, res) => {
  const year = parseInt(req.query.year);
  const level = req.query.level;

  if (!year) {
    return res.status(400).send("Year query parameter is required");
  }

  if (!level || (level !== "province" && level !== "regency")) {
    return res
      .status(400)
      .send("Level query parameter must be 'province' or 'regency'");
  }

  try {
    let poverties;
    if (level === "province") {
      poverties = await ProvincePoverty.find({ year }).populate(
        "province_id",
        "name"
      );
    } else if (level === "regency") {
      poverties = await RegencyPoverty.find({ year })
        .populate("province_id", "name")
        .populate("regency_id", "name province_id");
    }

    if (!poverties.length) {
      return res.status(404).send("No data found for the given year and level");
    }

    const povertyPercentages = poverties.map((p) => p.poverty_percentage);
    const stdDev = calculateStdDev(povertyPercentages);
    const mean =
      povertyPercentages.reduce((acc, val) => acc + val, 0) /
      povertyPercentages.length;
    const upper = mean + stdDev;
    const lower = mean - stdDev;

    const result = {
      std_dev: stdDev,
      upper,
      lower,
      data: poverties,
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server error");
  }
});

router.get("/province", async (req, res) => {
  const provinceName = req.query.name;

  if (!provinceName) {
    return res.status(400).send("Province name query parameter is required");
  }

  try {
    const provinceData = await ProvincePoverty.find()
      .populate({
        path: "province_id",
        match: { name: provinceName },
        select: "name"
      });

    const filteredData = provinceData.filter(p => p.province_id !== null);

    if (!filteredData.length) {
      return res.status(404).send("No data found for the given province name");
    }

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching province data:", error);
    res.status(500).send("Server error");
  }
});

router.get("/regency", async (req, res) => {
  const regencyName = req.query.name;

  if (!regencyName) {
    return res.status(400).send("Regency name query parameter is required");
  }

  try {
    const regencyData = await RegencyPoverty.find()
      .populate({
        path: "regency_id",
        match: { name: regencyName },
        select: "name"
      })
      .populate("province_id", "name");

    const filteredData = regencyData.filter(r => r.regency_id !== null);

    if (!filteredData.length) {
      return res.status(404).send("No data found for the given regency name");
    }

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching regency data:", error);
    res.status(500).send("Server error");
  }
});

router.get("/regency-poverty-by-year", async (req, res) => {
  const year = parseInt(req.query.year);

  if (!year) {
    return res.status(400).send("Year query parameter is required");
  }

  try {
    const data = await RegencyPoverty.find({ year })
      .populate("province_id", "name")
      .populate("regency_id", "name");

    if (!data.length) {
      return res.status(404).send("No data found for the given year");
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching regency poverty data:", error);
    res.status(500).send("Server error");
  }
});


router.post("/", async (req, res) => {
  const {
    province_id,
    regency_id,
    year,
    poverty_percentage,
    unemployed_percentage,
    uneducated_percentage,
  } = req.body;
  try {
    const data = new Poverty({
      province_id,
      regency_id,
      year,
      poverty_percentage,
      unemployed_percentage,
      uneducated_percentage,
    });
    await data.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;