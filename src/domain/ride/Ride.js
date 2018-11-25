const { attributes } = require('structure');

const Ride = attributes({
  driver: {
    type: 'User',
    required: true,
    email: true
  },
  passengers: {
    type: Array,
    itemType: 'User',
    required: true,
    minLength: 1,
    maxLength: 4,
    sparse: false
  },
  date: {
    type: Date,
    default: () => Date.now()
  },
  score: Number
}, {
  dynamics: {
    User: () => require('../user/User')
  }
})(class Ride {
  // Here will go methods, later
});

module.exports = Ride;