module.exports = {
  types: {
    validationError: 'ValidationError'
  },
  messages:{
    common: {
      duplicateFound: 'Duplicate found'
    },
    ride: {
      invalidDriverEmail: 'The driver field is not a valid e-mail.',
      invalidPassengerEmail: 'The passengers field is not an array of valid e-mails.'
    },
    user: {
      invalidEmail: 'The e-mail field is not valid.'
    }
  }
};