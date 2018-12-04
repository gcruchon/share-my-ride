const Operation = require('../Operation');

class GetAllUsers extends Operation {
  constructor({ usersRepository }) {
    super();
    this.usersRepository = usersRepository;
  }

  async execute() {
    const [ SUCCESS, ERROR ] = this.outputs;

    try {
      const users = await this.usersRepository.getAll();
      this.emit(SUCCESS, users);
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

GetAllUsers.setOutputs([Symbol('SUCCESS'), Symbol('ERROR')]);

module.exports = GetAllUsers;
