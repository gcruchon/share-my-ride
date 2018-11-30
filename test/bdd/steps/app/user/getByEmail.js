const { Before, When, After } = require('cucumber');

const GetByEmail = require('src/app/user/GetByEmail');
const MongoUserRepository = require('src/infrastructure/repository/user/MongoUsersRepository');
const DbUserModel = require('src/infrastructure/database/models/DbUser');
const usersRepository = new MongoUserRepository({ DbUserModel });
const repositoryErrors = require('src/infrastructure/repository/Errors');
const getByEmail = new GetByEmail({ usersRepository, repositoryErrors });
const { SUCCESS, ERROR, VALIDATION_ERROR } = getByEmail.outputs;

// Prepare
Before({ tags: '@app and @user and @getByEmail' }, function () {
  getByEmail.on(SUCCESS, this.spySuccess);
  getByEmail.on(ERROR, this.spyError);
  getByEmail.on(VALIDATION_ERROR, this.spyValidationError);
});

// Act
When('I get user {string}', async function (email) {
  await getByEmail.execute(email);
});

// Assert

// Clean
After({ tags: '@app and @user and @getByEmail' }, function () {
  getByEmail.removeAllListeners(SUCCESS);
  getByEmail.removeAllListeners(ERROR);
  getByEmail.removeAllListeners(VALIDATION_ERROR);
});