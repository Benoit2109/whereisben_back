const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    connection.query("SELECT * FROM countries", [req.params.id], (err, results) => {
        if(err) {
            res.status(500).json(err)
        } else if(results.length === 0) {
            res.status(404).send("albums not found...")
        } else {
            res.status(200).json(results)
        }
    })
})

module.exports = router;