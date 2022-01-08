const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { methodes } = require('../method/method');
const {
  getMovie,
  postMovie,
  deleteMovie,
} = require('../controllers/movie');

router.get('/movies', getMovie);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    movieId: Joi.number().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().length(4).required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(methodes),
    trailer: Joi.string().required().custom(methodes),
    thumbnail: Joi.string().required().custom(methodes),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovie);
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);
module.exports = router;
