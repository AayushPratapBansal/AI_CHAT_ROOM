const mongoose = require("mongoose");
const url= process.env.MONGO_URI ;
async function connectDB() {
  try {
    await mongoose.connect(url);
    console.log("connected to dtabase sucesfull");
  } catch (err) {
    console.error(err);

  }
}

module.exports = connectDB;
