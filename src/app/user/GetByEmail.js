const Operation = require('../Operation');

class GetByEmail extends Operation {
  constructor({ usersRepository }) {
    super();
    this.usersRepository = usersRepository;
  }

  async execute(email) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;

    try {
      const user = await this.usersRepository.getUserByEmail(email);
      this.emit(SUCCESS, user);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }
      this.emit(ERROR, error);
    }
  }
}

GetByEmail.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = GetByEmail;
