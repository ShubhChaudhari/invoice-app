require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connection = require("./db");
const invoiceRoutes = require('./routes/invoiceMaster.routes');
const productRoutes = require('./routes/productMaster.routes');
const app = express();

// database connection  
connection();

app.use(express.json());
app.use(cors());


//route
app.use('/api', invoiceRoutes);
app.use('/api', productRoutes);
app.listen(process.env.Port, () => {
    console.log(`Server is running at port ${process.env.Port}`);
  });
 