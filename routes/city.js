const express = require("express");
const router = express.Router();
const upload = require("../middlewares/Upload");
const connection = require("../db");

router.get("/", (req, res) => {
  connection.query("SELECT * FROM city", [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json(err);
    } else if (results.length === 0) {
      res.status(404).send("city not found...");
    } else {
      res.status(200).json(results);
    }
  });
});

router.post("/newcity", upload, (req, res) => {
  const newcity = req.body;
  newcity.photo = req.file.filename;

  console.log(req.file);
  console.log(newcity);
  connection.query("INSERT INTO city SET ?", [newcity], (err) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(201).json(newcity);
    }
  });
});

router.delete("/:id", (req, res) => {
  connection.query("DELETE FROM city WHERE id=?", [req.params.id], (err) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(204).send("city deleted");
    }
  });
});

module.exports = router;
