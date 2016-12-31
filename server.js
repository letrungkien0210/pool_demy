const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const secret = require('./config/secret');
const ejs = require('ejs');
const engine = require('ejs-mate');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');

let app = express();

mongoose.connect(secret.database, err => {
    if (err)
        console.log(err);
    else
        console.log("Connected to the database server.");
});

app.use(express.static(__dirname + '/public'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({ url: secret.database, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

require('./routes/main')(app);
require('./routes/user')(app);

app.listen(secret.port, err => {
    if (err)
        console.log(err);
    else
        console.log("Running on port 8282");
});