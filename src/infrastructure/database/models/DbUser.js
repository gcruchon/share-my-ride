const mongoose = require('mongoose');
const { isEmailValid } = require('../utils/validation');

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  lastname: { type: String, required: true },
  firstname: { type: String, required: true },
  score: { type: Number, required: true, default: 0 }
}, { timestamps: true });

/**
 * Statics
 */
userSchema.statics = {
  /**
     * Get user by email
     * @param {String} email - The email of user.
     * @returns {Promise<User, APIError>}
     */
  getByEmail(email) {
    return this.findOne({ _id: email });
  },

  /**
     * Get user by email
     * @param {String} email - The email of user.
     * @returns {boolean}
     */
  exist(email) {
    return this.findOne({ _id: email })
      .exec()
      .then((user) => {
        if (user) {
          return true;
        }

        return false;
      });
  },

  /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<DbUser[]>}
     */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

const errorMessageTransformer = (error, doc, next) => {
  if (error.code === 11000) {
    const newError = new Error('ValidationError');
    newError.details = 'Duplicate found';
    next(newError);
  } else {
    next(error);
  }
};

// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
userSchema.post('save', errorMessageTransformer);

userSchema.path('_id').validate(function (email) {
  return isEmailValid(email);
}, 'The e-mail field is not valid.');

const DbUser = mongoose.model('User', userSchema);


module.exports = DbUser;
module.exports.errorMessageTransformer = errorMessageTransformer;