const UserMapper = require('./MongoUserMapper');


class MongoUserRepository {

  constructor({ DbUserModel }) {
    this.DbUserModel = DbUserModel;
  }

  async getAll() {
    const dbUsers = await this.DbUserModel.list();
    return dbUsers.map(UserMapper.toEntity);
  }

  // RULES IN AS ENTITY --- OUT AS ENTITY
  async add(user) {
    // Validate and check user existance throw error if any
    await this._validate(user);
    await this._checkExistance(user);

    //1. Before save to database conver data from entity structure to database structure using same folder mapper
    const DbUser = new this.DbUserModel(UserMapper.toDatabase(user));
    const newDbUser = await DbUser.save();

    // 2 After getting the newly saved date from database convert the result back as enitity
    return UserMapper.toEntity(newDbUser);

  }

  async update(user) {
    // Validate user throw error if any
    await this._validate(user);
    const dbUser = await this._getDbUserByEmail(user);
    const { lastname, firstname } = user;
    dbUser.lastname = lastname;
    dbUser.firstname = firstname;
    const updatedDbUser = await dbUser.save();
    return UserMapper.toEntity(updatedDbUser);
  }

  async remove(email) {
    const dbUser = await this._getDbUserByEmail({ email });
    if (!dbUser) {
      const error = new Error('ValidationError');
      error.details = { message: 'User not exist' };
      throw error;
    }
    const deletedDbUser = await dbUser.remove();
    return UserMapper.toEntity(deletedDbUser);
  }

  async getUserByEmail(email) {
    const dbUser = await this._getDbUserByEmail({ email });
    if (!dbUser) {
      const error = new Error('ValidationError');
      error.details = { message: `User with email ${email} not found` };
      throw error;
    }

    return UserMapper.toEntity(dbUser);
  }

  //Private functions
  async _getDbUserByEmail({ email }) {
    return this.DbUserModel.getByEmail(email);
  }


  async _checkExistance({ email }) {
    // Validate wether user already exist
    if (await this.DbUserModel.exist(email)) {
      const error = new Error('ValidationError');
      error.details = { message: 'User already exist' };
      throw error;
    }

    return;
  }

  async _validate(user) {
    //We could call validate because of 'structure' library we defined as domain
    const { valid, errors } = user.validate();

    if (!valid) {
      const error = new Error('ValidationError');
      error.details = errors;
      throw error;
    }
  }

}

module.exports = MongoUserRepository;
