const Operation = require('../Operation');
const User = require('../../domain/user/User');

class CreateUser extends Operation {
  constructor({ usersRepository, repositoryErrors }) {
    super();
    this.usersRepository = usersRepository;
    this.repositoryErrors = repositoryErrors;
  }

  async execute({ email, lastname, firstname, score }) {
    const [ SUCCESS, ERROR, VALIDATION_ERROR ] = this.outputs;


    // Everything goes to repository must become Entity first
    const user = new User({ email, lastname, firstname, score });

    try {
      const newUser = await this.usersRepository.add(user);

      this.emit(SUCCESS, newUser);
    } catch (error) {
      if (error.message === this.repositoryErrors.types.validationError) {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreateUser.setOutputs([Symbol('SUCCESS'), Symbol('ERROR'), Symbol('VALIDATION_ERROR')]);

module.exports = CreateUser;
