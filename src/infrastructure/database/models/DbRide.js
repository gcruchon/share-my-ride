const mongoose = require('mongoose');
const { isEmailValid } = require('../utils/validation');
const Errors = require('../utils/Errors');


const rideSchema = new mongoose.Schema({
  driver: { type: 'String', ref: 'User', required: true },
  passengers: [{ type: 'String', ref: 'User' }],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const errorMessageTransformer = (error, doc, next) => {
  if (error.code === 11000) {
    const newError = new Error(Errors.types.validationError);
    newError.details = Errors.messages.common.duplicateFound;
    next(newError);
  } else {
    next(error);
  }
};

// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
rideSchema.post('save', errorMessageTransformer);
rideSchema.post('save', async (doc) => {
  await doc.populate('driver').populate('passengers').execPopulate();
});

rideSchema.path('driver').validate(function (email) {
  return isEmailValid(email);
}, Errors.messages.ride.invalidDriverEmail);

rideSchema.path('passengers').validate(function (passengers) {
  return passengers.reduce((previouslyValid, currentPassenger) => previouslyValid && isEmailValid(currentPassenger), true);
}, Errors.messages.ride.invalidPassengerEmail);

const DbRide = mongoose.model('Ride', rideSchema);

module.exports = DbRide;
module.exports.errorMessageTransformer = errorMessageTransformer;