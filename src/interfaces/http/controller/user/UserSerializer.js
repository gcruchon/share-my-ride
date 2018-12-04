const UserSerializer = {
  serialize({ email, lastname, firstname, score }) {
    return {
      email,
      lastname,
      firstname,
      score
    };
  }
};

module.exports = UserSerializer;
