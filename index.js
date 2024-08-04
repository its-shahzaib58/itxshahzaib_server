const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config();

const PORT  = process.env.PORT || 8000;
// Cors
app.use(cors());
app.use(express.json());

const GuideRoute = require("./routes/GuideRoute");
app.use('/',GuideRoute);

// console.log(process.env.CONNECTION_STRING)
mongoose.connect(process.env.CONNECTION_STRING);
  
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB");
  
    // once connected, start the server
    app.listen(PORT, () => {
      console.log("Server listening on port 8000");
    });
  });