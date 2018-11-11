const { Before, Given, When, Then, After } = require('cucumber')
const sinon = require('sinon');
const { expect } = require('chai');

const CreateUser = require('src/app/user/CreateUser');
const MongoUserRepository = require('src/infrastructure/repository/user/MongoUsersRepository');
const DbUserModel = require('src/infrastructure/database/models/DbUser');
const usersRepository = new MongoUserRepository({ DbUserModel });
const createUser = new CreateUser({ usersRepository });
const { SUCCESS, ERROR, VALIDATION_ERROR } = createUser.outputs;

// Prepare
Before(function () {
    this.spySuccess = sinon.spy();
    this.spyError = sinon.spy();
    this.spyValidationError = sinon.spy();

    createUser.on(SUCCESS, this.spySuccess);
    createUser.on(ERROR, this.spyError);
    createUser.on(VALIDATION_ERROR, this.spyValidationError);
})
// Arrange
Given('I want to create this user:', function (dataTable) {
    const users = dataTable.hashes();
    if (users.length) {
        this.user = users[0];
    }
    this.stubDbUserSave = sinon.stub(DbUserModel.prototype, 'save').resolves(Object.assign(this.user, { score: 0 }));
    this.stubDbUserExists = sinon.stub(DbUserModel, 'exist').resolves(false);
});
Given('user {string} does not exist', function (email) {
    this.existingEmail = email;
    this.stubDbUserExists.withArgs(email).resolves(false);
});
Given('user {string} already exists', function (email) {
    this.existingEmail = email;
    this.stubDbUserExists.withArgs(email).resolves(true);
});

// Act
When('I create this user', async function () {
    await createUser.execute(this.user);
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
Then('I get a {string} error', function (errorMessage) {
    const errorThrown = this.spyValidationError.lastCall.args[0];
    expect(errorThrown).to.be.a('Error');
    expect(errorThrown.message).to.equal('ValidationError');
    expect(errorThrown.details).to.deep.equal({ message: errorMessage });
});

// Clean
After(function () {
    sinon.reset();
    if (this.stubDbUserExists) {
        this.stubDbUserExists.restore();
    }
    if (this.stubDbUserSave) {
        this.stubDbUserSave.restore();
    }
    createUser.removeAllListeners(SUCCESS);
    createUser.removeAllListeners(ERROR);
    createUser.removeAllListeners(VALIDATION_ERROR);
})
