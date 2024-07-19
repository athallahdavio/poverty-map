const Province = require("../models/Province");

const getAllProvinces = async (req, res) => {
  try {
    const provinces = await Province.find();
    res.json(provinces);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createProvince = async (req, res) => {
  const { name } = req.body;
  try {
    const province = new Province({ name });
    await province.save();
    res.status(201).json(province);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getAllProvinces,
  createProvince,
};
