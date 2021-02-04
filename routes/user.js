const express = require('express')
const router = express.Router()
const connection = require("../db");

router.get('/', (req,res) => {
    connection.query("SELECT * FROM user", [req.params.id], (err, results) => {
        if(err) {
            res.status(500).json(err)
        } else if(results.length === 0) {
            res.status(404).send("user not found...")
        } else {
            res.status(200).json(results)
        }
    })
});

router.post('/newuser', (req,res) => {
    const newuser = req.body;
    connection.query('INSERT INTO user SET ?', [newuser], (err) => {
        if(err) {
            res.status(500).json(err)
        } else {
            res.status(201).json(newuser)
        }
    })
})

module.exports = router;