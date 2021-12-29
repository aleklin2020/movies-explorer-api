const Movie = require("../models/ModelMovie.js")

// Возврат всех карточек
module.exports.getMovie(req, res, next) => {
	const userIdMe = req.user._id
	Movie.find({})
	.then((Movies)=> {
		return res.send(Movies)
	})
	.catch((next))
}

module.exports.postMovie(req,res,next) => {
	const {country, director,
	 duration, year, 
	 description, image,
	  trailer, nameRU, 
	  nameEN , thumbnail, 
	  movieId } = req.body
const owner = req.user._id
 Movie.create({owner, country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId })
 .then((movie)=> {
 	return res.send(movie)
 })
 .catch((err) => {
 	//Отработать ошибки
 })
}

 module.exports.deleteMovie(req,res,next) => {
 	const {movieId} = req.params;
 	const UserIdMe = req.user._id
 	return Movie.findByid(movieId)
 	.then((movie) => {
 		if(!movie) {
 			// отработать ошибку
 		}
 		if(movie.owner._id.toString() === UserIdMe) {
 			Movie.findByIdAndRemove(movieId)
 			.then((deleteMovie) => {
 				res.send({message: deleteMovie})
 			})
 			.catch((err) => {
 				//отработать ошибки
 			})
 		} else {
 			// отработать ошибку нет права доступа
 		}
 	})
 }