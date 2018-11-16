const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
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
        return this.findOne({ email });
    },

    /**
     * Get user by email
     * @param {String} email - The email of user.
     * @returns {boolean}
     */
    exist(email) {
        return this.findOne({ email })
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

userSchema.path('email').validate(function (email) {
    const result = Joi.validate(email, Joi.string().email());
    if (result.error) {
        return false;
    }
    return true;
}, 'The e-mail field is not valid.')

const DbUser = mongoose.model('User', userSchema);


module.exports = DbUser;
module.exports.errorMessageTransformer = errorMessageTransformer