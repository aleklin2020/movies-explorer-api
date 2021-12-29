const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');
const {
	getMovie,
	postMovie,
	deleteMovie,
} = require("../controllers/movie")

router.get("/movies", getMovie)
router.post("/movies", postMovie)
router.delete('/movies/:movieID', deleteMovie)