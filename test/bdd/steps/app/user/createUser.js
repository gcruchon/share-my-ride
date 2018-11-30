const { Before, When, Then, After } = require('cucumber');
const { expect } = require('chai');

const CreateUser = require('src/app/user/CreateUser');
const MongoUserRepository = require('src/infrastructure/repository/user/MongoUsersRepository');
const DbUserModel = require('src/infrastructure/database/models/DbUser');
const usersRepository = new MongoUserRepository({ DbUserModel });
const repositoryErrors = require('src/infrastructure/repository/Errors');
const createUser = new CreateUser({ usersRepository, repositoryErrors });
const { SUCCESS, ERROR, VALIDATION_ERROR } = createUser.outputs;

// Prepare
Before({ tags: '@app and @user and @create' }, function () {
  createUser.on(SUCCESS, this.spySuccess);
  createUser.on(ERROR, this.spyError);
  createUser.on(VALIDATION_ERROR, this.spyValidationError);
});

// Act
When('I create this user', async function () {
  await createUser.execute(this.user);
});

// Assert
Then('I get the missing fields:', function (dataTable) {
  const expectedErrorDetails = dataTable.raw().map(
    (fieldArray) => {
      const [ field ] = fieldArray;
      return {
        message: `"${field}" is required`,
        path: field
      };
    }
  );
  const [ errorThrown ] = this.spyValidationError.lastCall.args;
  expect(errorThrown).to.be.a('Error');
  expect(errorThrown.message).to.equal(repositoryErrors.types.validationError);
  expect(errorThrown.details).to.deep.equal(expectedErrorDetails);
});

// Clean
After({ tags: '@app and @user and @create' }, function () {
  createUser.removeAllListeners(SUCCESS);
  createUser.removeAllListeners(ERROR);
  createUser.removeAllListeners(VALIDATION_ERROR);
});
