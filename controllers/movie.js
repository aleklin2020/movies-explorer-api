const Movie = require('../models/ModelMovie');
const IncorrectDataError = require('../erors/incorrect-data-err');
const ForbiddenDataError = require('../erors/forbidden-err');
const NotFoundError = require('../erors/not-found-err');

// Возврат всех фильмов
module.exports.getMovie = (req, res, next) => {
  Movie.find({})
    .then((Movies) => res.send(Movies))
    .catch((next));
};
// создание фильма
module.exports.postMovie = (req, res, next) => {
  const {
    country, director,
    duration, year,
    description, image,
    trailer, nameRU,
    nameEN, thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    owner,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при добавление фильма'));
      } else {
        next(err);
      }
    })
    .catch(next);
};
// удаление фильма
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const UserIdMe = req.user._id;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner._id.toString() === UserIdMe) {
        Movie.findByIdAndRemove(movieId)
          .then((deleteMovie) => {
            res.send({ Film: deleteMovie });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new IncorrectDataError('Передан некорректный id при удалении фильма'));
            } else {
              next(err);
            }
          });
      } else {
        next(new ForbiddenDataError('У Вас нет прав на удаление данного фильма'));
      }
    })
    .catch(next);
};
