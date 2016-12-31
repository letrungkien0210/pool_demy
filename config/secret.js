module.exports = {
    database: 'mongodb://root:changeit@ds149258.mlab.com:49258/pool_demy',
    port: 8282,
    secretKey: 'KienLT',
    facebook: {
        clientID: '343318819383614',
        clientSecret: '7652a574aeebf0e37488e35d7b16617e',
        profileFields: ['emails', 'displayName'],
        callbackURL: 'http://localhost:8282/auth/facebook/callback',
        passReqToCallback: true
    }
}