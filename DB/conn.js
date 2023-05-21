const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB);
    console.log(`Mongoose Connected ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB();
