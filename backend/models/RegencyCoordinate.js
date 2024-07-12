const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RegencyCoordinateSchema = new Schema({
  regency_id: { type: Schema.Types.ObjectId, ref: "Regency", required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

module.exports = mongoose.model("RegencyCoordinate", RegencyCoordinateSchema);
