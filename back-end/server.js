//const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const writeFileP = require("write-file-p");

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false, limit: "50MB" }));
app.use(bodyParser.json({ limit: "50MB" }));
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res, next) => {
  const fs = require("fs");

  let rawdata = fs.readFileSync(`csvs/${req.query.name}`);
  let data = JSON.parse(rawdata);

  return res.json({ success: true, data: data });
});

router.get("/listData", (req, res, next) => {
  const path = require("path");
  const fs = require("fs");
  //joining path of directory
  const directoryPath = path.join("csvs");

  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function(err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    let list = [];
    //listing all files using forEach
    files.forEach(function(file) {
      // Do whatever you want to do with the file
      list.push(file);
      //console.log(file);
    });

    return res.json({ success: true, data: list });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.get("/deleteData", (req, res, next) => {
  const fs = require("fs");

  fs.unlinkSync(`csvs/${req.query.name}.json`);

  return res.json({ success: true });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res, next) => {
  let data = new Data();

  const { id, name, columns, body } = req.body;

  if ((!id && id !== 0) || !name) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.name = name;
  data.id = id;
  data.columns = columns;
  data.body = body;

  writeFileP.sync(`csvs/${name}.json`, {
    data: data
  });

  return res.json({ success: true });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
