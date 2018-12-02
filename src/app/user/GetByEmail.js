const Operation = require('../Operation');

class GetByEmail extends Operation {
  constructor({ usersRepository, repositoryErrors }) {
    super();
    this.usersRepository = usersRepository;
    this.repositoryErrors = repositoryErrors;
  }

  async execute(email) {
    const [ SUCCESS, ERROR, VALIDATION_ERROR ] = this.outputs;

    try {
      const user = await this.usersRepository.getUserByEmail(email);
      this.emit(SUCCESS, user);
    } catch(error) {
      if(error.message === this.repositoryErrors.types.validationError) {
        return this.emit(VALIDATION_ERROR, error);
      }
      this.emit(ERROR, error);
    }
  }
}

GetByEmail.setOutputs([Symbol('SUCCESS'), Symbol('ERROR'), Symbol('VALIDATION_ERROR')]);

module.exports = GetByEmail;
