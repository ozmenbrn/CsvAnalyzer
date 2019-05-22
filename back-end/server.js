//const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const writeFileP = require("write-file-p");
const moment = require("moment");

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const username = "5342745714";
const password = "password";
const token = username + password;

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false, limit: "150MB" }));
app.use(bodyParser.json({ limit: "150MB" }));
app.use(logger("dev"));

function decrpytHash(text) {
  const CryptoJS = require("crypto-js");

  var bytes = CryptoJS.AES.decrypt(text.toString(), "Mine Secret");
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  return decryptedData;
}

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res, next) => {
  const fs = require("fs");

  let decrptedHash = decrpytHash(req.query.param);

  let isValid = false;

  for (var i = 0; i < 10; i++) {
    let current = token + (moment().unix() - i);
    if (decrptedHash === current) {
      isValid = true;
    }
  }

  if (!isValid) {
    return res.json({ success: false, data: [] });
  }

  let rawdata = fs.readFileSync(`csvs/${req.query.name}`);
  let data = JSON.parse(rawdata);

  return res.json({ success: true, data: data });
});

router.get("/listData", (req, res, next) => {
  const path = require("path");
  const fs = require("fs");
  //joining path of directory

  let decrptedHash = decrpytHash(req.query.param);

  let isValid = false;

  for (var i = 0; i < 10; i++) {
    let current = token + (moment().unix() - i);
    if (decrptedHash === current) {
      isValid = true;
    }
  }

  if (!isValid) {
    return res.json({ success: false, data: [] });
  }

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
      let searchQuery = req.query.query;
      if (
        file.substring(0, searchQuery.length) === searchQuery &&
        file.substring(file.length - 4) === "json"
      ) {
        list.push(file);
      }
    });

    return res.json({ success: true, data: list });
  });
});

// this is our delete method
// this method removes existing data in our database
router.get("/deleteData", (req, res, next) => {
  const fs = require("fs");

  let decrptedHash = decrpytHash(req.query.param);

  let isValid = false;

  for (var i = 0; i < 10; i++) {
    let current = token + (moment().unix() - i);
    if (decrptedHash === current) {
      isValid = true;
    }
  }

  if (!isValid) {
    return res.json({ success: false });
  }

  fs.unlinkSync(`csvs/${req.query.name}.json`);

  return res.json({ success: true });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res, next) => {
  let data = new Data();

  const { id, name, columns, body } = req.body;

  let decrptedHash = decrpytHash(req.query.param);

  let isValid = false;

  for (var i = 0; i < 10; i++) {
    let current = token + (moment().unix() - i);
    if (decrptedHash === current) {
      isValid = true;
    }
  }

  if (!isValid) {
    return res.json({ success: false });
  }

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
