const mongoose = require("mongoose");

module.exports = () => {
  try {
    mongoose.connect(process.env.DB);
    console.log("Connected to database succefully");
  } catch (error) {
    console.log(error);
    console.log("Could not connect database!");
  }
};
