const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CourseSchema = new Schema({
    title: String,
    desc: String,
    wistiaId: String,
    price: Number,
    ownByTeacher: { type: Schema.Types.ObjectId, red: 'User' },
    ownByStudent: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    totalStudents: Number
});

module.exports = mongoose.model('Course', CourseSchema);