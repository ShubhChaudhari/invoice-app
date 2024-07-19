const mongoose = require('mongoose');

const ProductMasterSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  rate: { type: Number, required: true },
  unit: { type: String, required: true }
});

module.exports = mongoose.model('ProductMaster', ProductMasterSchema);
