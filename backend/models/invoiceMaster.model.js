const mongoose = require('mongoose');

const InvoiceMasterSchema = new mongoose.Schema({
  invoiceNo: { type: Number, required: true },
  invoiceDate: { type: Date, required: true, default: new Date},
  customerName: { type: String, required: true },
  totalAmount: { type: Number, required: true }
});

module.exports = mongoose.model('InvoiceMaster', InvoiceMasterSchema);
