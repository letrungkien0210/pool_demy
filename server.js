const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const secret = require('./config/secret');

let app = express();

mongoose.connect(secret.database, err => {
    if (err)
        console.log(err);
    else
        console.log("Connected to the database server.");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

require('./routes/main')(app);

app.listen(secret.port, err => {
    if (err)
        console.log(err);
    else
        console.log("Running on port 8282");
});