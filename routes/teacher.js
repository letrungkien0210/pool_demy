const User = require('../models/user');
const Course = require('../models/course');
const async = require('async');

module.exports = app => {

    app.route('/become-an-instructor')
        .get((req, res) => {
            res.render('teacher/become-instructor');
        })
        .post((req, res, next) => {
            async.waterfall([
                callback => {
                    let course = new Course();
                    course.title = req.body.title;
                    course.save(err => {
                        callback(err, course);
                    });
                },
                (course, callback) => {
                    User.findOne({ _id: req.user._id }, (err, foundUser) => {
                        foundUser.role = "teacher";
                        foundUser.coursesTeach.push({ course: course._id });
                        foundUser.save(err => {
                            if (err) return next(err);
                            res.redirect('/teacher/dashboard')
                        });
                    });
                }

            ]);
        });

    app.get('/teacher/dashboard', (req, res) => {
        User.findOne({ _id: req.user._id })
            .populate('coursesTeach.course')
            .exec((err, foundUser) => {
                res.render('teacher/teacher-dashboard', { foundUser: foundUser });
            });
    });

    app.route('/create-course')
        .get((req, res) => {
            res.render('teacher/create-course');
        })
        .post((req, res, next) => {
            async.waterfall([
                callback => {
                    let course = new Course();
                    course.title = req.body.title;
                    course.price = req.body.price;
                    course.desc = req.body.desc;
                    course.wistiaId = req.body.wistiaId;
                    course.ownByTeacher = req.user._id;

                    course.save(err => {
                        callback(err, course);
                    });
                },
                (course, callback) => {
                    User.findOne({ _id: req.user._id }, (err, foundUser) => {
                        foundUser.coursesTeach.push({ course: course._id });
                        foundUser.save(err => {
                            if (err) return next(err);
                            res.redirect('/teacher/dashboard')
                        });
                    });
                }

            ]);
        });

    app.route('/edit-course/:id')
        .get((req, res, next) => {
            Course.findOne({ _id: req.params.id }, (err, foundCourse) => {
                if (err) return next(err);
                res.render('teacher/edit-course', { course: foundCourse });
            });
        })
        .post((req, res, next) => {
            Course.findOne({ _id: req.params.id }, (err, foundCourse) => {
                if (err) return next(err);

                if (foundCourse) {
                    if (req.body.title) foundCourse.title = req.body.title;
                    if (req.body.wistiaId) foundCourse.wistiaId = req.body.wistiaId;
                    if (req.body.price) foundCourse.price = req.body.price;
                    if (req.body.desc) foundCourse.desc = req.body.desc;

                    foundCourse.save(errr => {
                        if (err) return next(err);
                        res.redirect('/teacher/dashboard');
                    });
                }
            });
        });

    app.get('/revenue-report', (req, res) => {
        let revenue = 0;
        User.findOne({ _id: req.user._id }, (err, foundUser) => {
            foundUser.revenue.forEach(value => {
                revenue += value;
            });
        })

        res.render('teacher/revenue-report', { revenue: revenue });
    });
}