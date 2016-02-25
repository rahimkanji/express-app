var express = require('express');
var router = express.Router();

//======== require mongoose and model
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// ========= create post request for signup
router.post('/signup', function(req, res, next){
    if(!req.body.email || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }
    User.findOne({email: req.body.email}, function (err, user) {
        if (user) {
            return res.status(401).json({message: 'Email already exists in our records.'});
        }

        var user = new User();
        user.email = req.body.email;
        user.setPassword(req.body.password);

        user.save(function (err) {
            if (err) {
                return next(err);
            }

            return res.json(user);

            return res.json({token: user.generateJWT()});
        });
    });
});

router.post('/login', function(req, res, next){
    if(!req.body.email || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if(err){ return next(err); }
        if (!user) {
            return res.json( { message: 'Email not found in our records.' });
        }
        if (!user.validPassword(req.body.password)) {
            return res.json( { message: 'Incorrect password.' });
        }
        return res.json({token: user.generateJWT()});
    });


});

router.get('/allUsers', function(req, res, next) {
    User.find(function(err, users){
        if(err){ return next(err); }

        res.json(users);
    });
});



module.exports = router;
