const RegencyPoverty = require("../models/RegencyPoverty");
const ProvincePoverty = require("../models/ProvincePoverty");
const Province = require("../models/Province");
const Regency = require("../models/Regency");

function calculateStdDev(arr) {
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  const squareDiffs = arr.map((val) => Math.pow(val - mean, 2));
  const avgSquareDiff =
    squareDiffs.reduce((acc, val) => acc + val, 0) / arr.length;
  return Math.sqrt(avgSquareDiff);
}

const getAllProvincePovertyData = async (req, res) => {
  try {
    const data = await ProvincePoverty.find().populate("province_id");
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAllRegencyPovertyData = async (req, res) => {
  try {
    const data = await RegencyPoverty.find()
      .populate("province_id")
      .populate("regency_id");
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getOverallPovertyData = async (req, res) => {
    const { year } = req.params;
    
    try {
      // Ambil data ProvincePoverty untuk tahun yang diberikan
      const provinceData = await ProvincePoverty.find({ year }).populate("province_id");
  
      // Ambil data RegencyPoverty untuk tahun yang diberikan
      const regencyData = await RegencyPoverty.find({ year }).populate("province_id").populate("regency_id");
  
      // Hitung total poverty_amount dari ProvincePoverty
      const totalPovertyAmount = provinceData.reduce((acc, item) => acc + item.poverty_amount, 0);
  
      // Dapatkan regency dengan poverty_percentage tertinggi
      const highestPovertyRegency = regencyData.reduce((prev, current) => (prev.poverty_percentage > current.poverty_percentage) ? prev : current);
  
      // Dapatkan regency dengan unemployed_percentage tertinggi
      const highestUnemployedRegency = regencyData.reduce((prev, current) => (prev.unemployed_percentage > current.unemployed_percentage) ? prev : current);
  
      // Dapatkan regency dengan uneducated_percentage tertinggi
      const highestUneducatedRegency = regencyData.reduce((prev, current) => (prev.uneducated_percentage > current.uneducated_percentage) ? prev : current);
  
      // Dapatkan province dengan poverty_percentage tertinggi
      const highestPovertyProvince = provinceData.reduce((prev, current) => (prev.poverty_percentage > current.poverty_percentage) ? prev : current);
  
      // Dapatkan province dengan unemployed_percentage tertinggi
      const highestUnemployedProvince = provinceData.reduce((prev, current) => (prev.unemployed_percentage > current.unemployed_percentage) ? prev : current);
  
      // Dapatkan province dengan uneducated_percentage tertinggi
      const highestUneducatedProvince = provinceData.reduce((prev, current) => (prev.uneducated_percentage > current.uneducated_percentage) ? prev : current);
  
      // Siapkan respon JSON
      const response = {
        totalPovertyAmount,
        highestPovertyRegency,
        highestUnemployedRegency,
        highestUneducatedRegency,
        highestPovertyProvince,
        highestUnemployedProvince,
        highestUneducatedProvince
      };
  
      res.json(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

const getProvincePovertyYear = async (req, res) => {
  try {
    const data = await ProvincePoverty.distinct("year");
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getRegencyPovertyYear = async (req, res) => {
  try {
    const data = await RegencyPoverty.distinct("year");
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getPovertyDataByOption = async (req, res) => {
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

    const povertyAmount = poverties.map((p) => p.poverty_amount);
    const stdDev = calculateStdDev(povertyAmount);
    const mean =
      povertyAmount.reduce((acc, val) => acc + val, 0) / povertyAmount.length;
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
};

const getPovertyDataByProvince = async (req, res) => {
  const provinceName = req.query.name;

  if (!provinceName) {
    return res.status(400).send("Province name query parameter is required");
  }

  try {
    const provinceData = await ProvincePoverty.find().populate({
      path: "province_id",
      match: { name: provinceName },
      select: "name",
    });

    const filteredData = provinceData.filter((p) => p.province_id !== null);

    if (!filteredData.length) {
      return res.status(404).send("No data found for the given province name");
    }

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching province data:", error);
    res.status(500).send("Server error");
  }
};

const getPovertyDataByRegency = async (req, res) => {
  const regencyName = req.query.name;

  if (!regencyName) {
    return res.status(400).send("Regency name query parameter is required");
  }

  try {
    const regencyData = await RegencyPoverty.find()
      .populate({
        path: "regency_id",
        match: { name: regencyName },
        select: "name",
      })
      .populate("province_id", "name");

    const filteredData = regencyData.filter((r) => r.regency_id !== null);

    if (!filteredData.length) {
      return res.status(404).send("No data found for the given regency name");
    }

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching regency data:", error);
    res.status(500).send("Server error");
  }
};

const getRegencyPovertyDataByYear = async (req, res) => {
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
};

const getProvincePovertyDataByYear = async (req, res) => {
  const year = parseInt(req.query.year);

  if (!year) {
    return res.status(400).send("Year query parameter is required");
  }

  try {
    const data = await ProvincePoverty.find({ year }).populate("province_id");

    if (!data.length) {
      return res.status(404).send("No data found for the given year");
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching province poverty data:", error);
    res.status(500).send("Server error");
  }
};

const createProvincePovertyData = async (req, res) => {
  const {
    province_name,
    year,
    poverty_amount,
    poverty_percentage,
    unemployed_percentage,
    uneducated_percentage,
  } = req.body;

  if (
    !province_name ||
    !year ||
    !poverty_amount ||
    !poverty_percentage ||
    !unemployed_percentage ||
    !uneducated_percentage
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const province = await Province.findOne({ name: province_name });
    if (!province) {
      return res.status(404).json({ message: "Province not found" });
    }

    const existingRecord = await ProvincePoverty.findOne({
      province_id: province._id,
      year,
    });
    if (existingRecord) {
      return res.status(400).json({
        message: "Data for the given province and year already exists",
      });
    }

    const newProvincePoverty = new ProvincePoverty({
      province_id: province._id,
      year,
      poverty_amount,
      poverty_percentage,
      unemployed_percentage,
      uneducated_percentage,
    });

    await newProvincePoverty.save();

    res.status(201).json(newProvincePoverty);
  } catch (error) {
    console.error("Error adding province poverty data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createRegencyPovertyData = async (req, res) => {
  const {
    province_name,
    regency_name,
    year,
    poverty_amount,
    poverty_percentage,
    unemployed_percentage,
    uneducated_percentage,
  } = req.body;

  if (
    !province_name ||
    !regency_name ||
    !year ||
    !poverty_amount ||
    !poverty_percentage ||
    !unemployed_percentage ||
    !uneducated_percentage
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const province = await Province.findOne({ name: province_name });
    if (!province) {
      return res.status(404).json({ message: "Province not found" });
    }

    const regency = await Regency.findOne({
      name: regency_name,
      province: province._id,
    });
    if (!regency) {
      return res.status(404).json({ message: "Regency not found" });
    }

    const existingRecord = await RegencyPoverty.findOne({
      regency_id: regency._id,
      year,
    });
    if (existingRecord) {
      return res.status(400).json({
        message: "Data for the given regency and year already exists",
      });
    }

    const newRegencyPoverty = new RegencyPoverty({
      province_id: province._id,
      regency_id: regency._id,
      year,
      poverty_amount,
      poverty_percentage,
      unemployed_percentage,
      uneducated_percentage,
    });

    await newRegencyPoverty.save();

    res.status(201).json(newRegencyPoverty);
  } catch (error) {
    console.error("Error adding regency poverty data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProvincePovertyData = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ProvincePoverty.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send("Data not found");
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const deleteRegencyPovertyData = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await RegencyPoverty.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send("Data not found");
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const updateProvincePovertyData = async (req, res) => {
  const { id } = req.params;
  const {
    year,
    poverty_amount,
    poverty_percentage,
    unemployed_percentage,
    uneducated_percentage,
  } = req.body;

  try {
    const result = await ProvincePoverty.findByIdAndUpdate(
      id,
      {
        year,
        poverty_amount,
        poverty_percentage,
        unemployed_percentage,
        uneducated_percentage,
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).send("Data not found");
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const updateRegencyPovertyData = async (req, res) => {
  const { id } = req.params;
  const {
    year,
    poverty_amount,
    poverty_percentage,
    unemployed_percentage,
    uneducated_percentage,
  } = req.body;

  try {
    const result = await RegencyPoverty.findByIdAndUpdate(
      id,
      {
        year,
        poverty_amount,
        poverty_percentage,
        unemployed_percentage,
        uneducated_percentage,
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).send("Data not found");
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

module.exports = {
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
};
