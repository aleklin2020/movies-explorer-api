const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserMe,
  patchUserMe,
} = require('../controllers/users');

router.get('/users/me', getUserMe);

router.patch('/users/me', celebrate({
  // валидируем body
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), patchUserMe);

module.exports = router;
