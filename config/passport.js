const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const secret = require('./secret');

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
            let newUser = new User();
            newUser.email = profile._json.email;
            newUser.facebook = profile.id;
            newUser.tokens.push({ kind: 'facebook', token: token });
            newUser.profile.name = profile.displayName;
            newUser.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;

            newUser.save(err => {
                if (err) throw err;
                req.flash('loginMessage', 'Successfully login with facebook');
                return done(null, newUser);
            });
        }
    });
}));