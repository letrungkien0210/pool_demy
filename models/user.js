const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    facebook: String,
    tokens: Array,
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