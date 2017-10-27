
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const RequiredString = {
    type: String,
    required: true
}; 

const reviewerSchema = new Schema ({
    email: RequiredString,
    company: RequiredString,
    hash: RequiredString   
});

reviewerSchema.methods.generateHash = function(password) {
    this.hash = bcrypt.hashSync(password, 8);
};

reviewerSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};

reviewerSchema.statics.emailExists = function(email) {
    return this.find({email})
        .count()
        .then(count => count > 0);
};

module.exports = mongoose.model('Reviewer', reviewerSchema);


