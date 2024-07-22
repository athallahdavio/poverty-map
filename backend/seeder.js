const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs");
const connectDB = require("./config/database");

const Province = require("./models/Province");
const Regency = require("./models/Regency");
const ProvincePoverty = require("./models/ProvincePoverty");
const RegencyPoverty = require("./models/RegencyPoverty");
const User = require("./models/User");

async function main() {
  try {
    await connectDB();
    console.log("MongoDB Connected");
    await seedAdminUser();
    await importProvinces();
    await importProvincePovertyData();
    await importRegencyPovertyData();
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

async function seedAdminUser() {
  try {
    const user = new User({
      username: "admin",
      email: "admin@povertymap.com",
      password: "password",
    });

    await user.save();
    console.log("Admin user created");
  } catch (err) {
    console.error(err.message);
  }
}

async function importProvinces() {
  const provinces = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream("./src/provinces.csv")
      .pipe(csv({ separator: ";" }))
      .on("data", (row) => {
        provinces.push({ name: row.name });
      })
      .on("end", async () => {
        try {
          const insertedProvinces = await Province.insertMany(provinces);
          console.log("Provinces imported:", insertedProvinces);
          await importRegencies(insertedProvinces);
          resolve();
        } catch (error) {
          console.error("Error importing provinces:", error);
          reject(error);
        }
      });
  });
}

async function importRegencies(insertedProvinces) {
  const regencyData = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream("./src/regencies.csv")
      .pipe(csv({ separator: ";" }))
      .on("data", (row) => {
        regencyData.push(row);
      })
      .on("end", async () => {
        try {
          const regencies = [];
          for (const row of regencyData) {
            const province = insertedProvinces.find(prov => prov.name === row.province_name);
            if (province) {
              const regency = { name: row.name, province_id: province._id };
              regencies.push(regency);
            } else {
              console.warn(`Province not found for name: ${row.province_name}`);
            }
          }
          const insertedRegencies = await Regency.insertMany(regencies);
          console.log("Regencies imported:", insertedRegencies);
          resolve();
        } catch (error) {
          console.error("Error importing regencies:", error);
          reject(error);
        }
      });
  });
}

async function importProvincePovertyData() {
  const provincePovertyData = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream("./src/province_data.csv")
      .pipe(csv({ separator: ";" }))
      .on("data", (row) => {
        provincePovertyData.push(row);
      })
      .on("end", async () => {
        try {
          for (const row of provincePovertyData) {
            const province = await Province.findOne({ name: row.province_name });
            if (province) {
              const poverty_amount = row.poverty_amount ? row.poverty_amount : 0;
              const poverty_percentage = row.poverty_percentage ? parseFloat(row.poverty_percentage.replace(",", ".")) : 0;
              const unemployed_percentage = row.unemployed_percentage ? parseFloat(row.unemployed_percentage.replace(",", ".")) : 0;
              const uneducated_percentage = row.uneducated_percentage ? parseFloat(row.uneducated_percentage.replace(",", ".")) : 0;

              const provincePoverty = new ProvincePoverty({
                province_id: province._id,
                year: row.year,
                poverty_amount: poverty_amount,
                poverty_percentage: poverty_percentage,
                unemployed_percentage: unemployed_percentage,
                uneducated_percentage: uneducated_percentage,
              });
              await provincePoverty.save();
            } else {
              console.warn(`Province not found for name: ${row.province_name}`);
            }
          }
          console.log("Province poverty data imported");
          resolve();
        } catch (error) {
          console.error("Error importing province poverty data:", error);
          reject(error);
        }
      });
  });
}

async function importRegencyPovertyData() {
  const regencyPovertyData = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream("./src/regency_data.csv")
      .pipe(csv({ separator: ";" }))
      .on("data", (row) => {
        regencyPovertyData.push(row);
      })
      .on("end", async () => {
        try {
          for (const row of regencyPovertyData) {
            const province = await Province.findOne({ name: row.province_name });
            if (province) {
              const regency = await Regency.findOne({ name: row.regency_name, province_id: province._id });
              if (regency) {
                const poverty_amount = row.poverty_amount ? row.poverty_amount : 0;
                const poverty_percentage = row.poverty_percentage ? parseFloat(row.poverty_percentage.replace(",", ".")) : 0;
                const unemployed_percentage = row.unemployed_percentage ? parseFloat(row.unemployed_percentage.replace(",", ".")) : 0;
                const uneducated_percentage = row.uneducated_percentage ? parseFloat(row.uneducated_percentage.replace(",", ".")) : 0;

                const regencyPoverty = new RegencyPoverty({
                  province_id: province._id,
                  regency_id: regency._id,
                  year: row.year,
                  poverty_amount: poverty_amount,
                  poverty_percentage: poverty_percentage,
                  unemployed_percentage: unemployed_percentage,
                  uneducated_percentage: uneducated_percentage,
                });
                await regencyPoverty.save();
              } else {
                console.warn(`Regency not found for name: ${row.regency_name}`);
              }
            } else {
              console.warn(`Province not found for name: ${row.province_name}`);
            }
          }
          console.log("Regency poverty data imported");
          resolve();
        } catch (error) {
          console.error("Error importing regency poverty data:", error);
          reject(error);
        }
      });
  });
}

main().then(() => {
  mongoose.connection.close();
  console.log("MongoDB connection closed");
});
