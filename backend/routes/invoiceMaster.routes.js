const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceMaster.controller');

router.post('/invoices', invoiceController.createInvoice);
router.get('/invoices', invoiceController.getInvoices);

module.exports = router;
