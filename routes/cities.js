const express = require('express')
const router = express.Router()

const connection = require('../db');

router.get('/', (req,res) => {
    connection.query("SELECT * FROM countries INNER JOIN cities ON cities.countries_id = cities.id", [req.params.id], (err, results) => {
        if(err) {
            res.status(500).json(err)
        } else if(results.length === 0) {
            res.status(404).send("cities not found...")
        } else {
            res.status(200).json(results)
        }
    })
})

router.post('/newcity', (req,res) => {
    const newcity = req.body;
    connection.query('INSERT INTO cities SET ?', [newcity], (err) => {
        if(err) {
            res.status(500).json(err)
        } else {
            res.status(201).json(newcity)
        }
    })
})

router.delete('/:id', (req, res) => {
    connection.query("DELETE FROM cities WHERE id=?", [req.params.id], (err) => {
        if(err) {
            res.status(500).json(err)
        } else {
            res.status(204).send("city deleted")
        }
    })
})

module.exports = router;