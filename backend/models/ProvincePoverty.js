const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProvincePovertySchema = new Schema({
  province_id: { type: Schema.Types.ObjectId, ref: 'Province' },
  year: { type: Number, required: true },
  poverty_amount: { type: Number, required: true },
  poverty_percentage: { type: Number, required: true },
  unemployed_percentage: { type: Number, required: true },
  uneducated_percentage: { type: Number, required: true }
});

module.exports = mongoose.model('ProvincePoverty', ProvincePovertySchema);