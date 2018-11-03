const Operation = require('../Operation');

class DeleteUser extends Operation {
  constructor({ usersRepository }) {
    super();
    this.usersRepository = usersRepository;
  }

  async execute(email) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;

    try {
      const user = await this.usersRepository.remove(email);
      this.emit(SUCCESS, user);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }
      this.emit(ERROR, error);
    }
  }
}

DeleteUser.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = DeleteUser;
