var mongoose = require('mongoose');
var crypto = require('crypto');

//========= Added for Authentication
var jwt = require('jsonwebtoken');
var appConfig = require('../config/settings');
//========= Added for Authentication

var UserSchema = new mongoose.Schema({
    email: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String,
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }]
});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

//========= Added for Authentication
UserSchema.methods.generateJWT = function() {
    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 1);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000)
    }, appConfig.secret);
};
//========= Added for Authentication


mongoose.model('User', UserSchema);