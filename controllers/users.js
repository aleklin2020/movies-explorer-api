
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require("../models/ModelUser")


const { NODE_ENV, JWT_SECRET } = process.env;

// регистрация пользователя 
module.exports.postUserNew(req,res,next) => {
	const { email, password, name} = req.body
bcrypt
    .hash(password, 10) // хешируем пароль
    .then((hash) => {
      if (!validator.isEmail('aleks@yandex.com')) {
        throw new IncorrectDataError('Передан некорректный e-mail');
      }
     return User.create({name, email, password: hash,}) 
     .then((user) => {
     	return res.send({ message: user})
     })
     .catch((user) => {
     	// отработать ошибки
     })

}

// аутентификация пользователя 

module.exports.login(req,res,next) => {
	const { email, password} = req.body
	 User.findOne({ email }).select('+password')
	 .then((user)=> {
	 	if(!user) {
	 		// отработать ошибку
	 	}
	 	 return bcrypt.compare(password, user.password)
	 	 .then((matched) => {
	 	 	if(!matched) {
	 	 		// отработать ошибку
	 	 	}
	 	 	 const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
	 	 	 res.send({token})
	 	 })
	 	 .catch(next)
	 })
	 .catch(next)
}



// Получение информаций о пользователи
module.exports.getUserMe = (reg, res, next) => {
	const userIdMe = req.user._id
	User.findById(userIdMe)
	.then((user) => {
		if(user) {
			return res.send({
				message: user
			})
			// отработать ошибку централизованную
		}

	})
	.catch ((err) => {
		// отработать ошибки
	})
}
// Обновление информаций о пользователи
module.exports.patchUserMe( reg, res, next) => {
	const {name, email} = req.body 
	return User.findByIdAndUpdate(req.user._id, name, email)
	.then((user) => {
		if(user) {
			return res.send({
				message: user,
			})
			// Отработать ошибку не найден пользователь
		}
	})
	.catch((err) => {
		// Отработать остальные ошибки
	})
}