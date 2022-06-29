var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: String,
    password: String,
	profilPicture: {data: Buffer, contentType: String},
});

module.exports = {
	Image: new mongoose.model('User', userSchema)
}