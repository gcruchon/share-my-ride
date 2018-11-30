const Operation = require('../Operation');
const User = require('../../domain/user/User');

class UpdateUser extends Operation {
  constructor({ usersRepository, repositoryErrors }) {
    super();
    this.usersRepository = usersRepository;
    this.repositoryErrors = repositoryErrors;
  }

  async execute({ email, lastname, firstname, score }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const user = new User({ email, lastname, firstname, score });

    try {
      const updateUser = await this.usersRepository.update(user);
      this.emit(SUCCESS, updateUser);
    } catch (error) {
      if (error.message === this.repositoryErrors.types.validationError) {
        return this.emit(VALIDATION_ERROR, error);
      }
      this.emit(ERROR, error);
    }
  }
}

UpdateUser.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = UpdateUser;