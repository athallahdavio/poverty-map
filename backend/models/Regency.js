const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RegencySchema = new Schema({
  name: { type: String, required: true },
  province_id: { type: Schema.Types.ObjectId, ref: "Province", required: true },
});

module.exports = mongoose.model("Regency", RegencySchema);