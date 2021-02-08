const express = require("express");
const router = express.Router();
const connection = require("../db");
const bcrypt = require("bcrypt");
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

router.get("/", (req, res) => {
  connection.query("SELECT * FROM user", [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json(err);
    } else if (results.length === 0) {
      res.status(404).send("user not found...");
    } else {
      res.status(200).json(results);
    }
  });
});

router.post("/newuser", async (req, res) => {
  const { user_name, firstname, email, password } = req.body;
  if (!email || !password || !user_name || !firstname) {
    res.status(400).send("Merci de renseigner tous les champs d'inscriptions");
  } else {
    const hashpassword = await bcrypt.hashSync(password, 10);
    connection.query(
      "INSERT INTO user (user_name, firstname, email, password) VALUE (?,?,?,?)",
      [user_name, firstname, email, hashpassword],
      (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message, sql: err.sql });
        } else {
          return res.status(201).json({
            id: result.insertId,
            user_name,
            firstname,
            email,
            password: hashpassword,
          });
        }
      }
    );
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ errorMessage: "Merci de renseigner vos identifiants" });
  } else {
    connection.query(
      "SELECT * FROM user WHERE email=?",
      [email],
      (err, result) => {
        if (err) {
          res.status(500).json({
            error: err.message,
            sql: err.sql,
          });
        } else if (result.length === 0) {
          res.status(403).json({ errorMessage: err.message });
        } else if (bcrypt.compareSync(password, result[0].password)) {
          const user = {
            id: result[0].id,
            email,
            password: "hidden",
          };
          const token = jwt.sign(
            {
              id: user.id,
            },
            JWT_SECRET,
            { expiresIn: "1h" }
          );
          res.status(200).json({ user, token });
        } else {
          res.status(403).send("invalid password");
        }
      }
    );
  }
});

module.exports = router;
