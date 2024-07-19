const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs");
const faker = require("faker");
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
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

const provinces = [];
const regencies = [];

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
  return new Promise((resolve, reject) => {
    fs.createReadStream("./src/provinces.csv")
      .pipe(csv())
      .on("data", (row) => {
        provinces.push({ name: row.name });
      })
      .on("end", async () => {
        try {
          const insertedProvinces = await Province.insertMany(provinces);
          console.log("Provinces imported:", insertedProvinces);
          await importRegencies(insertedProvinces);
          await fillProvincePovertyData(insertedProvinces);
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
          for (const row of regencyData) {
            const province = await Province.findOne({ name: row.province_name });
            if (province) {
              const regency = { name: row.name, province_id: province._id };
              regencies.push(regency);
            } else {
              console.warn(`Province not found for name: ${row.province_name}`);
            }
          }
          const insertedRegencies = await Regency.insertMany(regencies);
          console.log("Regencies imported:", insertedRegencies);
          await fillRegencyPovertyData(insertedRegencies);
          resolve();
        } catch (error) {
          console.error("Error importing regencies:", error);
          reject(error);
        }
      });
  });
}

async function fillProvincePovertyData(insertedProvinces) {
  const years = [2020, 2021, 2022];
  try {
    for (const province of insertedProvinces) {
      for (const year of years) {
        const poverty = new ProvincePoverty({
          province_id: province._id,
          year: year,
          poverty_percentage: faker.datatype.float({
            min: 5,
            max: 50,
            precision: 0.01,
          }),
          unemployed_percentage: faker.datatype.float({
            min: 1,
            max: 20,
            precision: 0.01,
          }),
          uneducated_percentage: faker.datatype.float({
            min: 0,
            max: 10,
            precision: 0.01,
          }),
          poverty_amount: faker.datatype.number({ min: 1000, max: 100000 }),
        });
        console.log("Creating Province Poverty record:", poverty);
        await poverty.save();
      }
    }
    console.log("Province poverty data filled");
  } catch (error) {
    console.error("Error filling province poverty data:", error);
  }
}

async function fillRegencyPovertyData(insertedRegencies) {
  const years = [2020, 2021, 2022];
  try {
    for (const regency of insertedRegencies) {
      for (const year of years) {
        const poverty = new RegencyPoverty({
          province_id: regency.province_id,
          regency_id: regency._id,
          year: year,
          poverty_percentage: faker.datatype.float({
            min: 5,
            max: 50,
            precision: 0.01,
          }),
          unemployed_percentage: faker.datatype.float({
            min: 1,
            max: 20,
            precision: 0.01,
          }),
          uneducated_percentage: faker.datatype.float({
            min: 0,
            max: 10,
            precision: 0.01,
          }),
          poverty_amount: faker.datatype.number({ min: 1000, max: 100000 }),
        });
        console.log("Creating Regency Poverty record:", poverty);
        await poverty.save();
      }
    }
    console.log("Regency poverty data filled");
  } catch (error) {
    console.error("Error filling regency poverty data:", error);
  }
}

main().then(() => {
  mongoose.connection.close();
  console.log("MongoDB connection closed");
});
