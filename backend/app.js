require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const connectDB = require("./config/database");
const povertyRoutes = require("./routes/povertyRoutes");
const provinceRoutes = require("./routes/provinceRoutes");
const regencyRoutes = require("./routes/regencyRoutes");
const authRoutes = require("./routes/authRoutes");

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/poverties", povertyRoutes);
app.use("/api/provinces", provinceRoutes);
app.use("/api/regencies", regencyRoutes);
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
