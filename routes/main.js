const Course = require('../models/course');
const User = require('../models/user');
const async = require('async');

module.exports = function(app) {
    app.get('/', (req, res) => {
        res.render("main/home");
    })

    app.get('/courses', (req, res) => {
        Course.find({}, (err, courses) => {
            res.render('courses/courses', { courses: courses });
        })
    });

    app.get('/courses/:id', (req, res) => {
        async.parallel([
            callback => {
                Course.findOne({ _id: req.params.id })
                    .populate('ownByStudent.user')
                    .exec((err, foundCourse) => {
                        callback(err, foundCourse);
                    });
            },
            callback => {
                User.findOne({ _id: req.user._id, 'coursesTaken.course': req.params.id })
                    .populate('coursesTaken.course')
                    .exec((err, foundUserCourse) => {
                        callback(err, foundUserCourse);
                    });
            },
            callback => {
                User.findOne({ _id: req.user._id, 'coursesTeach.course': req.params.is })
                    .populate('coursesTeach.course')
                    .exec((err, foundUserCourse) => {
                        callback(err, foundUserCourse);
                    });
            }
        ], (err, results) => {
            let course = results[0];
            let userCourse = results[1];
            let teacherCourse = results[2];
            if (userCourse === null && teacherCourse === null) {
                res.render('courses/courseDesc', { course: course });
            } else if (userCourse === null && teacherCourse != null) {
                res.render('courses/course', { course: course });
            } else {
                res.render('courses/course', { course: course });
            }
        });
    });
}