const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/ModelUser');
const IncorrectDataError = require('../erors/incorrect-data-err');
const UnauthorizedError = require('../erors/unauthorized-err');
const NotFoundError = require('../erors/not-found-err');
const IncorrectEmail = require('../erors/IncorrectEmail');

const { NODE_ENV, JWT_SECRET } = process.env;

// регистрация пользователя
module.exports.postUserNew = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10) // хешируем пароль
    .then((hash) => {
      if (!validator.isEmail('aleks@yandex.com')) {
        throw new IncorrectDataError('Передан некорректный e-mail');
      }
      return User.create({ name, email, password: hash })
        .then((user) => { return res.send({ message: user }); })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new IncorrectDataError('Передан некорректный e-mail'));
          }
          if (err.name === 'MongoServerError' && err.code === 11000) {
            next(new IncorrectEmail('Пользователь с таким e-mail уже существует'));
          } else {
            next(err);
          }
        });
    });
};

// аутентификация пользователя

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

// Получение информаций о пользователи
module.exports.getUserMe = (req, res, next) => {
  const userIdMe = req.user._id;
  User.findById(userIdMe)
    .then((user) => {
      if (user) {
        return res.send({
          info: user,
        });
      }
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Передан некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};
// Обновление информаций о пользователи
module.exports.patchUserMe = (req, res, next) => {
  const { name, email } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.send({
          message: user,
        });
      }
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Передан некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};
