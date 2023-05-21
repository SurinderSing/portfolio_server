const mongoose = require("mongoose");

const DB = process.env.DATABASE;
mongoose
  .connect(DB, { useNewUrlParser: true })
  .then(() => {
    console.log("connect successful");
  })
  .catch((err) => {
    console.log(`unable to connect: ${err}`);
  });
