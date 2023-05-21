const dotenv = require("dotenv");
// const mongoose = require("mongoose");
const express = require("express");
const bp = require('body-parser')
const app = express();
//configring Dotenv::
dotenv.config({ path: "./config.env" });
//connecting to DATABASE::
require("./DB/conn");

// Parsing Post Data To JSON::
// app.use(express.json());
// app.use(express.urlencoded());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));


//linking Routes from Router folder::
app.use(require("./Router/auth"));

// declaring Port::

const port = process.env.PORT || 5000;

if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

//Listing To The Server::
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
