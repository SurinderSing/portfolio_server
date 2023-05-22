const dotenv = require("dotenv").config();
const express = require("express");
const bp = require("body-parser");
const app = express();
const cors = require("cors");

// cors middleware ::

const corsOpts = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "UPDATE", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(cors(corsOpts));

//connecting to DATABASE::
require("./DB/conn");

// Parsing Post Data To JSON::

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

//linking Routes from Router folder::
app.use(require("./Router/auth"));

// declaring Port::

app.get("/", (req, res) => {
  res.send({ message: "Surinder Singh" });
});

const port = process.env.PORT || 5000;

//Listing To The Server::
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
