const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');
const {
	getUserMe,
	patchUserMe,
} = require("../controllers/users")

router.get("/users/me", getUserMe)

router.patch("/users/me", patchUserMe)
