const User = require('../../../domain/user/User');

const MongoUserMapper = {
  toEntity( dataValues ) {
    const { email, lastname, firstname, score } = dataValues;
      
    return new User({ email, lastname, firstname, score });
  },
      
  toDatabase(survivor) {
    const { email, lastname, firstname, score } = survivor;
      
    return { email, lastname, firstname, score };
  }
};

module.exports = MongoUserMapper;