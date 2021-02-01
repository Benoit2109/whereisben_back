const express = require ('express');
require('dotenv').config();
const app = express();
const citiesRoute = require('./routes/cities');
const countriesRoute = require('./routes/countries');



app.use(express.json());

app.use('/cities', citiesRoute)
app.use('/countries', countriesRoute)

app.listen(process.env.PORT, (err) => {
    if(err) {
        throw new Error('Something bad happenned...');
    }
    console.log(`Server is listening on ${process.env.PORT}`);
})