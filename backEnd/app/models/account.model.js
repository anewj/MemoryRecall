const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
    name: String,
    emailId: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Account', AccountSchema);