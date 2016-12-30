const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    profile: {
        name: { type: String, default: '' },
        picture: { type: String, default: '' }
    },
    coursesTeach: [{
        course: { type: Schema.Types.ObjectId, ref: 'Course' }
    }],
    coursesTaken: [{
        course: { type: Schema.Types.ObjectId, ref: 'Course' }
    }]
});

module.exports = mongoose.model('User', UserSchema);