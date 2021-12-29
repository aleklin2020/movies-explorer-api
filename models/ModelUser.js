const mongoose = require("mongoose");
const validator = require('validator');

const userModel = new mongoose.Schema ({
name: {
 type: String,
 required: true,
    default: "Алексей",
    minlength: 2, 
    maxlength: 30, 
},
email: {
	type: String,
	required: true,
	 unique: true,
    validate: {
      validator: (v) => {
        validator.isEmail(v);
      },
    },
},
 password: {
    type: String,
    required: true,
    select: false,
  }
})

module.exports = mongoose.model("user", userModel);