const User = require('../../../domain/user/User');

const MongoUserMapper = {
  toEntity( dbUser ) {
    const { _id, lastname, firstname, score } = dbUser;
    return new User({ email: _id, lastname, firstname, score });
  },
      
  toDatabase(entityUser) {
    const { email, lastname, firstname, score } = entityUser;
    return { _id: email, lastname, firstname, score };
  }
};

module.exports = MongoUserMapper;