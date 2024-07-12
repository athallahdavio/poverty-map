require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/database");

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/provinces', require('./routes/provinces'));
app.use('/api/regencies', require('./routes/regencies'));
app.use('/api/poverties', require('./routes/poverties'));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
