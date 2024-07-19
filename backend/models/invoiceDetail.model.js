const mongoose = require('mongoose');

const InvoiceDetailSchema = new mongoose.Schema({
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'InvoiceMaster', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductMaster', required: true },
  rate: { type: Number, required: true },
  unit: { type: String, required: true },
  qty: { type: Number, required: true },
  discount: { type: Number, required: true },
  netAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true }
});

module.exports = mongoose.model('InvoiceDetail', InvoiceDetailSchema);
