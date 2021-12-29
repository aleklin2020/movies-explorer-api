require('dotenv').config();
const express = require('express');
const app = express(); 
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const routerMovie = require("./routes/movie")
const routerUser = require("./routes/users")


const { login, postUserNew} = require("./controllers/users.js")


const  PORT = 3001;
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,

});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.post("/signin", login)
app.post("/signup", postUserNew)


// сделать зашиту авторизаций 

app.use("/", routerUser)
app.use("/", routerMovie)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
}) 