const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const citiesRoute = require("./routes/city");
const usersRoute = require("./routes/user");

app.use(express.static("uploads"));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use("/cities", citiesRoute);
app.use("/users", usersRoute);

app.listen(process.env.PORT, (err) => {
  if (err) {
    throw new Error("Something bad happenned...");
  }
  console.log(`Server is listening on ${process.env.PORT}`);
});
