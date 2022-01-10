require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
// const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const NotFoundError = require('./erors/not-found-err');
const routerMovie = require('./routes/movie');
const routerUser = require('./routes/users');
const centrErrors = require('./middlewares/centralizErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { login, postUserNew } = require('./controllers/users');

const PORT = 3000;
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,

});

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*
app.use((req, res, next) => {
  req.user = {
    _id: '61cf074e2efe0c4a2d2fe35e'
  };

  next();
});
*/
app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(2).max(30)
        .required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(2).max(30)
        .required(),
    }),
  }),
  postUserNew,
);

app.use(auth);

app.use('/', routerUser);
app.use('/', routerMovie);
app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(centrErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
