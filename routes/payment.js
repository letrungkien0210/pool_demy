const User = require('../models/user');
const Course = require('../models/course');
const stripe = require('stripe')('sk_test_htnurIXIXfE6UNuigY5mhodK');
const async = require('async');

module.exports = app => {

    app.post('/payment', (req, res, next) => {
        let stripeToken = req.body.stripeToken;
        let courseId = req.body.courseId;

        async.waterfall([
            callback => {
                console.log(courseId);
                Course.findOne({ _id: courseId }, (err, foundCourse) => {
                    if (foundCourse) {
                        callback(err, foundCourse);
                    }
                });
            },
            (foundCourse, callback) => {
                stripe.customers.create({
                    source: stripeToken,
                    email: req.user.email
                }).then(customer => {
                    return stripe.charges.create({
                        amount: foundCourse.price,
                        currency: 'usd',
                        customer: customer.id
                    }).then(charge => {
                        async.parallel([
                            callback => {
                                Course.update({ _id: courseId, 'ownByStudent.user': { $ne: req.user._id } }, {
                                    $push: { ownByStudent: { user: req.user._id } },
                                    $inc: { totalStudents: 1 }
                                }, (err, count) => {
                                    if (err) return next(err);
                                    callback(err);
                                });
                            },
                            callback => {
                                User.update({
                                    _id: req.user._id,
                                    'coursesTaken.course': { $ne: courseId }
                                }, {
                                    $push: { coursesTaken: { course: courseId } },
                                }, (err, count) => {
                                    if (err) return next(err);
                                    callback(err);
                                });
                            },
                            callback => {
                                User.update({
                                    _id: foundCourse.ownByTeacher
                                }, {
                                    $push: { revenue: { money: foundCourse.price } }
                                }, (err, count) => {
                                    if (err) return next(err);
                                    callback(err);
                                })
                            }
                        ], (err, result) => {
                            if (err) return next(err);
                            res.redirect('/courses/' + courseId);
                        });
                    });
                });
            }
        ]);
    });
}