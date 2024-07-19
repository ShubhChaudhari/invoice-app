const InvoiceMaster = require('../models/invoiceMaster.model');
const InvoiceDetail = require('../models/invoiceDetail.model');

exports.createInvoice = async (req, res) => {
  try {
    const lastInvoice = await InvoiceMaster.findOne({}, {}, { sort: { 'createdAt': -1 } });

    let nextInvoiceNo = 1; 
    if (lastInvoice) {
      nextInvoiceNo = lastInvoice.invoiceNo + 1;
    }

    const { invoiceDate, customerName, totalAmount, invoiceDetails } = req.body;
    const invoice = new InvoiceMaster({
      invoiceNo: nextInvoiceNo,
      invoiceDate,
      customerName,
      totalAmount
    });
    await invoice.save();

    const details = invoiceDetails.map(detail => ({
      ...detail,
      invoiceId: invoice._id
    }));

    await InvoiceDetail.insertMany(details);

    res.status(201).json({ invoice, invoiceDetails: details });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  console.log('invoices')
  try {
    const invoices = await InvoiceMaster.find();
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
