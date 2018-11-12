const { Before, Given, Then, After } = require('cucumber');
const sinon = require('sinon');

const DbUserModel = require('src/infrastructure/database/models/DbUser');

// Prepare
Before({ tags: "@app and @user" }, function () {
    this.spySuccess = sinon.spy();
    this.spyError = sinon.spy();
    this.spyValidationError = sinon.spy();
});

// Arrange
Given('the affected user is:', function (dataTable) {
    const users = dataTable.hashes();
    if (users.length) {
        this.user = users[0];
    }
    this.stubDbUserSave = sinon.stub(DbUserModel.prototype, 'save').resolves(new DbUserModel(Object.assign(this.user, { score: 0 })));
    this.stubDbUserRemove = sinon.stub(DbUserModel.prototype, 'remove').resolves(new DbUserModel(Object.assign(this.user, { score: 0 })));
    this.stubDbUserExists = sinon.stub(DbUserModel, 'exist').resolves(false);
    this.stubDbUserGetByEmail = sinon.stub(DbUserModel, 'getByEmail');
});
Given('user {string} does not exist in the system', function (email) {
    this.stubDbUserExists.withArgs(email).resolves(false);
    this.stubDbUserGetByEmail.withArgs(email).resolves(null);
});
Given('user {string} already exists in the system', function (email) {
    this.stubDbUserExists.withArgs(email).resolves(true);
    this.stubDbUserGetByEmail.withArgs(email).resolves(new DbUserModel(Object.assign(this.user, { score: 0 })));
});

// Assert
Then('the operation is successful', function () {
    sinon.assert.calledOnce(this.spySuccess);
    sinon.assert.notCalled(this.spyError);
    sinon.assert.notCalled(this.spyValidationError);
});
Then('the operation is failing', function () {
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

// Clean
After({ tags: "@app and @user" }, function () {
    sinon.reset();
    this.spySuccess = null;
    this.spyError = null;
    this.spyValidationError = null;
    if (this.stubDbUserSave) {
        this.stubDbUserSave.restore();
    }
    if (this.stubDbUserRemove) {
        this.stubDbUserRemove.restore();
    }
    if (this.stubDbUserExists) {
        this.stubDbUserExists.restore();
    }
    if (this.stubDbUserGetByEmail) {
        this.stubDbUserGetByEmail.restore();
    }
})