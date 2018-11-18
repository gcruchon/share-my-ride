const { Before, When, After } = require('cucumber');

const DeleteUser = require('src/app/user/DeleteUser');
const MongoUserRepository = require('src/infrastructure/repository/user/MongoUsersRepository');
const DbUserModel = require('src/infrastructure/database/models/DbUser');
const usersRepository = new MongoUserRepository({ DbUserModel });
const deleteUser = new DeleteUser({ usersRepository });
const { SUCCESS, ERROR, VALIDATION_ERROR } = deleteUser.outputs;

// Prepare
Before({ tags: '@app and @user and @delete' }, function () {
  deleteUser.on(SUCCESS, this.spySuccess);
  deleteUser.on(ERROR, this.spyError);
  deleteUser.on(VALIDATION_ERROR, this.spyValidationError);
});

// Act
When('I delete user {string}', async function (email) {
  await deleteUser.execute(email);
});

// Clean
After({ tags: '@app and @user and @delete' }, function () {
  deleteUser.removeAllListeners(SUCCESS);
  deleteUser.removeAllListeners(ERROR);
  deleteUser.removeAllListeners(VALIDATION_ERROR);
});