import React, { useCallback, useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
  Box,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { createInvoice, getProducts } from "../services/FormService"; 
import InvoiceTable from "./InvoiceTable";
import { isRequired, isText, validate } from "../utils/validation";

const productStaticData = [
  {
    "productName": "Product A",
    "rate": 19.99,
    "unit": "piece"
  },
  {
    "productName": "Product B",
    "rate": 24.99,
    "unit": "pack"
  },
  {
    "productName": "Product C",
    "rate": 9.99,
    "unit": "item"
  },
  {
    "productName": "Product D",
    "rate": 49.99,
    "unit": "set"
  },
  {
    "productName": "Product E",
    "rate": 14.99,
    "unit": "unit"
  }
]

const InvoiceForm = () => {
  const [form, setForm] = useState({
    customerName: "",
    productId: "",
    qty: "",
    discount: "",
    rate: 0,
    unit: "",
    netAmount: 0,
    totalAmount: 0,
  });
  const [products, setProducts] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState({ customerName: "" });
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    if (name === "customerName") {
      errorMessage = validate(value, [
        { check: isRequired, message: "Customer name is required." },
        { check: isText, message: "Only letters and spaces are allowed." },
      ]);
    } else if (name === "qty") {
      errorMessage = validate(value, [
        { check: isRequired, message: "Quantity is required." },
      ]);
    } else if (name === "discount") {
      errorMessage = validate(value, [
        { check: isRequired, message: "Discount is required." },
        {
          check: (value) => parseInt(value, 10) <= 100,
          message: "Discount must be less than 100.",
        },
      ]);
    } else if (name === "productId") {
      errorMessage = validate(value, [
        { check: isRequired, message: "Product selection is required." },
      ]);
    }

    setErrors({ ...errors, [name]: errorMessage });
    setForm({ ...form, [name]: value });
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const selectedProduct = products.find(
      (product) => product._id === productId
    );
    if (selectedProduct) {
      setForm({
        ...form,
        productId: selectedProduct._id,
        rate: selectedProduct.rate,
        unit: selectedProduct.unit,
        netAmount: calculateNetAmount(selectedProduct.rate, form.discount),
      });
    }
  };

  const calculateNetAmount = (rate, discount) => {
    return rate - rate * (discount / 100);
  };

  const calculateTotalAmount = (netAmount, qty) => {
    return netAmount * qty;
  };

  const handleQtyChange = (e) => {
    handleInputChange(e);
    const qty = parseInt(e.target.value);
    const { rate, discount } = form;
    const netAmount = calculateNetAmount(rate, discount);
    const totalAmount = calculateTotalAmount(netAmount, qty);
    setForm({
      ...form,
      qty: qty,
      netAmount: netAmount,
      totalAmount: totalAmount,
    });
  };

  const handleDiscountChange = (e) => {
    handleInputChange(e);
    const discount = parseInt(e.target.value);
    const { rate, qty } = form;
    const netAmount = calculateNetAmount(rate, discount);
    const totalAmount = calculateTotalAmount(netAmount, qty);
    setForm({
      ...form,
      discount: discount,
      netAmount: netAmount,
      totalAmount: totalAmount,
    });
  };

  const handleAddData = (e) => {
    e.preventDefault();

    const requiredFields = ["customerName", "productId", "qty", "discount"];
    let hasErrors = false;

    requiredFields.forEach((field) => {
      if (!form[field]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`,
        }));
        hasErrors = true;
      }
    });

    const netAmount = calculateNetAmount(form.rate, form.discount);
    const totalAmount = calculateTotalAmount(netAmount, form.qty);
    if (editingIndex !== null) {
      const updatedTableData = tableData.map((data, index) =>
        index === editingIndex ? { ...form, netAmount, totalAmount } : data
      );
      console.log(updatedTableData);
      setTableData(updatedTableData);
      setEditingIndex(null);
    } else {
      setTableData([
        ...tableData,
        {
          ...form,
          netAmount: netAmount,
          totalAmount: totalAmount,
        },
      ]);
    }
  };

  const handleEdit = useCallback(
    (index) => {
      const invoiceToEdit = tableData[index];
      setForm(invoiceToEdit);
      setEditingIndex(index);
    },
    [tableData]
  );

  const handleDelete = useCallback(
    (index) => {
      const updatedTableData = tableData.filter((_, i) => i !== index);
      setTableData(updatedTableData);
    },
    [tableData]
  );

  const resetForm = () => {
    setForm({
      customerName: "",
      productId: "",
      qty: "",
      discount: "",
      rate: 0,
      unit: "",
      netAmount: 0,
      totalAmount: 0,
    });
    setTableData([]);
  };

  const handleSubmit = async () => {
    try {
      const invoiceData = {
        customerName: form.customerName,
        totalAmount: tableData.reduce((acc, row) => acc + row.totalAmount, 0),
        invoiceDetails: tableData,
      };
      const response = await createInvoice(invoiceData);
      setOpenSuccess(true);
      resetForm();
    } catch (error) {}
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Invoice Form
        </Typography>
        <form onSubmit={handleAddData}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Customer Name:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="customerName"
                value={form.customerName}
                onChange={handleInputChange}
                // required
                fullWidth
                disabled={tableData.length > 0}
                error={!!errors.customerName}
                helperText={errors.customerName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Product:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="productId"
                value={form.productId}
                onChange={handleProductChange}
                select
                // required
                fullWidth
                error={!!errors.productId}
              helperText={errors.productId}
              >
                {products.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.productName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Rate:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">{form.rate}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Unit:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">{form.unit}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Qty:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="qty"
                value={form.qty}
                onChange={handleQtyChange}
                // required
                fullWidth
                type="number"
                error={!!errors.qty}
              helperText={errors.qty}
            />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Discount (%):</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="discount"
                value={form.discount}
                onChange={handleDiscountChange}
                // required
                fullWidth
                
                type="number"
                error={!!errors.discount}
              helperText={errors.discount}
            />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Net Amount:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                {form.netAmount.toFixed(2)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Total Amount:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                {form.totalAmount.toFixed(2)}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {editingIndex !== null ? "Update" : "+ ADD"}
              </Button>
            </Grid>
          </Grid>
        </form>
        <InvoiceTable
          tableData={tableData}
          products={products}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
        <Button
          onClick={handleSubmit}
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          Invoice submitted successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default InvoiceForm;
