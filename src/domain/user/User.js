const { attributes } = require('structure');

const User = attributes({
  email: {
    type: String,
    required: true,
    email: true
  },
  lastname: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  score: Number
})(class User {
  // Here will go methods, later
});

module.exports = User;