const ProductMaster = require('../models/productMaster.model');

exports.createProduct = async (req, res) => {
  try {
    const { productId, productName, rate, unit } = req.body;
    const product = new ProductMaster({ productId, productName, rate, unit });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await ProductMaster.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
