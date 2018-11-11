const { Given, Then, When, After } = require('cucumber')
const sinon = require('sinon');
const { expect } = require('chai');

// Arrange
Given('I have this user', function (dataTable) {
    const users = dataTable.hashes();
    if (users.length) {
        this.user = users[0];
    }
});

// Act
When('I create this user', async function () {
    const CreateUser = require('src/app/user/CreateUser');
    const MongoUserRepository = require('src/infrastructure/repository/user/MongoUsersRepository');
    const DbUserModel = require('src/infrastructure/database/models/DbUser');

    this.spySuccess = sinon.spy();
    this.spyError = sinon.spy();
    this.spyValidationError = sinon.spy();
    const stubDbUserExists = sinon.stub(DbUserModel, 'exist').resolves(false);
    const stubDbUserSave = sinon.stub(DbUserModel.prototype, 'save').resolves(Object.assign(this.user, { score: 0 }));
    
    const usersRepository = new MongoUserRepository({DbUserModel});
    const createUser = new CreateUser({usersRepository});
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createUser.outputs;
    createUser.on(SUCCESS, this.spySuccess);
    createUser.on(ERROR, this.spyError);
    createUser.on(VALIDATION_ERROR, this.spyValidationError);
    await createUser.execute(this.user);

    stubDbUserExists.restore();
    stubDbUserSave.restore();
});

// Assert
Then('the creation is successful', function () {
    sinon.assert.calledOnce(this.spySuccess);
    sinon.assert.notCalled(this.spyError);
    sinon.assert.notCalled(this.spyValidationError);
});
Then('the creation is failing', function () {
    sinon.assert.notCalled(this.spySuccess);
    sinon.assert.notCalled(this.spyError);
    sinon.assert.calledOnce(this.spyValidationError);
});
Then('I get the user', function (dataTable) {
    const users = dataTable.hashes();
    if (users.length) {
        let user = users[0];
        user.score = Number.parseInt(user.score, 10);
        const UserMapper = require('src/infrastructure/repository/user/MongoUserMapper');
        sinon.assert.calledWith(this.spySuccess, UserMapper.toEntity(user));
    }
});
Then('I get the missing fields:', function (dataTable) {
    const expectedErrorDetails = dataTable.raw().map(
        (fieldArray) => {
            const field = fieldArray[0];
            return {
                message: `"${field}" is required`,
                path: field
            }
        }
    );
    const errorThrown = this.spyValidationError.lastCall.args[0];
    expect(errorThrown).to.be.a('Error');
    expect(errorThrown.message).to.equal('ValidationError');
    expect(errorThrown.details).to.deep.equal(expectedErrorDetails);
  });

// Hooks
After(function () {
    sinon.reset();
})
