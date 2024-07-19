const Regency = require("../models/Regency");

const getAllRegencies = async (req, res) => {
  try {
    const regencies = await Regency.find().populate("province_id");
    res.json(regencies);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createRegency = async (req, res) => {
  const { name, province_id } = req.body;
  try {
    const regency = new Regency({ name, province_id });
    await regency.save();
    res.status(201).json(regency);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getAllRegencies,
  createRegency,
};
