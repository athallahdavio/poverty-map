const express = require("express");
const {
  getAllProvincePovertyData,
  getAllRegencyPovertyData,
  getOverallPovertyData,
  getProvincePovertyYear,
  getRegencyPovertyYear,
  getPovertyDataByOption,
  getPovertyDataByProvince,
  getPovertyDataByRegency,
  getProvincePovertyDataByYear,
  getRegencyPovertyDataByYear,
  createProvincePovertyData,
  createRegencyPovertyData,
  deleteProvincePovertyData,
  deleteRegencyPovertyData,
  updateProvincePovertyData,
  updateRegencyPovertyData,
} = require("../controllers/povertyController");

const router = express.Router();

router.get("/province", getAllProvincePovertyData);
router.get("/regency", getAllRegencyPovertyData);
router.get("/overall/:year", getOverallPovertyData);
router.get("/province-year", getProvincePovertyYear);
router.get("/regency-year", getRegencyPovertyYear);
router.get("/option", getPovertyDataByOption);
router.get("/province/name", getPovertyDataByProvince);
router.get("/regency/name", getPovertyDataByRegency);
router.get("/province/year", getProvincePovertyDataByYear);
router.get("/regency/year", getRegencyPovertyDataByYear);
router.post("/province", createProvincePovertyData);
router.post("/regency", createRegencyPovertyData);
router.delete("/province/:id", deleteProvincePovertyData);
router.delete("/regency/:id", deleteRegencyPovertyData);
router.put("/province/:id", updateProvincePovertyData);
router.put("/regency/:id", updateRegencyPovertyData);

module.exports = router;
