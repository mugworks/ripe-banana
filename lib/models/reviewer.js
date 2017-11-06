
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const RequiredString = {
    type: String,
    required: true
};

const schema = new Schema ({

    name: RequiredString,

    company: RequiredString,

    email: RequiredString,

    hash: RequiredString,

    roles: [RequiredString]

});

schema.methods.generateHash = function(password) {
    this.hash = bcrypt.hashSync(password, 8);
};

schema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};

schema.statics.emailExists = function(email) {
    return this.find({ email })
        .count()
        .then(count => count > 0);
};

module.exports = mongoose.model('Reviewer', schema);


