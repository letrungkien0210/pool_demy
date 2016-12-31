const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const secret = require('./secret');
const async = require('async');
const request = require('request');

let User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
})



passport.use(new FacebookStrategy(secret.facebook, function(req, token, refreshToken, profile, done) {
    User.findOne({ facebook: profile.id }, function(err, user) {
        if (err) done(err);

        if (user) {
            req.flash('loginMessage', 'Successfully login with facebook');
            return done(null, user);
        } else {
            async.waterfall([
                callback => {
                    let newUser = new User();
                    newUser.email = profile._json.email;
                    newUser.facebook = profile.id;
                    newUser.tokens.push({ kind: 'facebook', token: token });
                    newUser.profile.name = profile.displayName;
                    newUser.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;

                    newUser.save(err => {
                        if (err) throw err;
                        req.flash('loginMessage', 'Successfully login with facebook');
                        callback(null, newUser);
                    });
                },
                (newUser, callback) => {
                    request({
                        url: 'https://us14.api.mailchimp.com/3.0/lists/996f1a4e12/members',
                        method: 'POST',
                        headers: {
                            'Authorization': 'randomUser 1409fd6e0ada44b878f610bf9f291305-us14',
                            'Content-Type': 'application/json'
                        },
                        json: {
                            'email_address': newUser.email,
                            'status': 'subscribed'
                        }
                    }, (err, response, body) => {
                        if (err) {
                            return done(err, newUser);
                        } else {
                            console.log("Success");
                            return done(null, newUser);
                        }
                    });
                }
            ]);


        }
    });
}));