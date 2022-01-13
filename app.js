require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const limiter = require('./middlewares/limiter');
const auth = require('./middlewares/auth');
const NotFoundError = require('./erors/not-found-err');
const routerMovie = require('./routes/movie');
const routerUser = require('./routes/users');
const routerUserAuth = require('./routes/index');
const centrErrors = require('./middlewares/centralizErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const PORT = 3000;
mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use('/', routerUserAuth);
app.use(auth);
app.use('/', routerUser);
app.use('/', routerMovie);
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errors());
app.use(errorLogger);
app.use(centrErrors);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
