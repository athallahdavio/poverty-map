const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProvinceCoordinateSchema = new Schema({
  province_id: { type: Schema.Types.ObjectId, ref: "Province", required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

module.exports = mongoose.model("ProvinceCoordinate", ProvinceCoordinateSchema);
