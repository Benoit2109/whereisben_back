const express = require("express");
const router = express.Router();
const upload = require("../middlewares/Upload");
const connection = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET} = process.env;

const authenticateWithJsonWebToken = (req, res, next) => {
  if (req.headers.authorization !== undefined) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err) => {
      if (err) {
        res
          .status(401)
          .json({ errorMessage: "you're not allowed to access these data" });
      } else {
        next();
      }
    });
  } else {
    res
      .status(401)
      .json({ errorMessage: "you're not allowed to access these data" });
  }
};

router.get("/user/:id", authenticateWithJsonWebToken,(req, res) => {
  connection.query("SELECT * FROM city WHERE city.user_id = ?", [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(results);
    }
  });
});

router.post("/newcity", authenticateWithJsonWebToken, upload, (req, res) => {
  const newcity = req.body;
  newcity.photo = req.file.filename;
  
  connection.query("INSERT INTO city SET ?", [newcity], (err) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(201).json(newcity);
    }
  });
});

router.delete("/:id", (req, res) => {
  connection.query("DELETE FROM city WHERE id=?", authenticateWithJsonWebToken, [req.params.id], (err) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(204).send("city deleted");
    }
  });
});



module.exports = router;
