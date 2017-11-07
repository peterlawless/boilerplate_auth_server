const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
// lowercase property removes case sensitivity before validation
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String
})

// beforeSave lifecycle callback to encrypt password
userSchema.pre('save', function(next) {
  // context of this function is the user model
  const user = this;

  // generate a salt, then run callback
  // (a salt is just a randomly generated string of characters)
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    // hash (encrypt) password using the salt, then run callback
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }

      // overwrite plaintext password with encrypted password
      // returned hash contains both the original salt and the hashed password
      user.password = hash;
      // save the model
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
};

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
