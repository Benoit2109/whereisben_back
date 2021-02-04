const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('./database');



const { SERVER_PORT, CLIENT_URL, JWT_SECRET } = process.env;

const app = express();


app.use(
  cors({
    origin: CLIENT_URL,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    res.status(400).send('Please specify your email or password');
  } else {
    const hashpassword = bcrypt.hashSync(password, 10);
    connection.query(
      'INSERT INTO user (email, password) VALUE (?,?)',
      [email, hashpassword],
      (err, result) => {
        if (err) {
          res.status(500).json({
            error: err.message,
            sql: err.sql,
          });
        } else {
          return res.status(201).json({
            id: result.insertId,
            email,
            password: hashpassword,
          });
        }
      }
    );
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === '' || password === '') {
    res.status(400).send('Please specify your email or password');
  } else {
    connection.query(
      'SELECT * FROM user WHERE email=?',
      [email],
      (err, result) => {
        if (err) {
          res.status(500).json({
            error: err.message,
            sql: err.sql,
          });
        } else if (result.length === 0) {
          res.status(403).send('Invalid email');
        } else if (bcrypt.compareSync(password, result[0].password)) {
          const token = jwt.sign(
            {
              id: result.id,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
          );
          const user = {
            id: result[0].id,
            email,
            password: 'hidden',
          };
          res.status(200).json({ user, token });
        } else {
          res.status(403).send('invalid password');
        }
      }
    );
  }
});

const authenticateWithJsonWebToken = (req, res, next) => {
  if (req.headers.authorization !== undefined) {
    const token = req.headers.authorization.split(' ')[1];
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

app.get('/users', authenticateWithJsonWebToken, (req, res) => {
  connection.query('SELECT * FROM user', (err, result) => {
    if (err) {
      res.status(500).json({
        error: err.message,
        sql: err.sql,
      });
    } else {
      res.status(200).json(
        result.map((user) => {
          return { ...user, password: 'hidden' };
        })
      );
    }
  });
});


