const mongoose = require('mongoose');

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


// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
userSchema.post('save', function (error, doc, next) {
    if (error.code === 11000) {
        const error = new Error('ValidationError');
        error.details = 'Duplicate found';
        next(error);
    } else {
        next(error);
    }
});

const DbUser = mongoose.model('User', userSchema);


module.exports = DbUser;