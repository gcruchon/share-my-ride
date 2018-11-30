const { Before, Given, Then, After } = require('cucumber');
const sinon = require('sinon');
const { expect } = require('chai');
const mongoose = require('mongoose');

const DbUserModel = require('src/infrastructure/database/models/DbUser');
const repositoryErrors = require('src/infrastructure/repository/Errors');

// Prepare
Before({ tags: '@app and @user' }, function () {
  this.spySuccess = sinon.spy();
  this.spyError = sinon.spy();
  this.spyValidationError = sinon.spy();

  this.stubDbUserSave = sinon.stub(DbUserModel.prototype, 'save');
  this.stubDbUserRemove = sinon.stub(DbUserModel.prototype, 'remove');
  this.stubDbUserExists = sinon.stub(DbUserModel, 'exist');
  this.stubDbUserGetByEmail = sinon.stub(DbUserModel, 'getByEmail');
  this.stubDbUserList = sinon.stub(DbUserModel, 'list');
});

// Arrange
Given('the affected user is:', function (dataTable) {
  const users = dataTable.hashes();
  if (users.length) {
    [ this.user ] = users;
  }
  this.stubDbUserSave.resolves(new DbUserModel(Object.assign(this.user, { score: 0 })));
  this.stubDbUserRemove.resolves(new DbUserModel(Object.assign(this.user, { score: 0 })));
  this.stubDbUserExists.resolves(false);
});
Given('user {string} does not exist in the system', function (email) {
  this.stubDbUserExists.withArgs(email).resolves(false);
  this.stubDbUserGetByEmail.withArgs(email).resolves(null);
});
Given('user {string} already exists in the system', function (email) {
  this.stubDbUserExists.withArgs(email).resolves(true);
  this.stubDbUserGetByEmail.withArgs(email).resolves(new DbUserModel(Object.assign(this.user, { score: 0 })));
});
Given('the system does not contain any users', function () {
  this.userList = [];
  this.stubDbUserList.resolves([]);
  this.stubDbUserGetByEmail.resolves(null);
});
Given('the system contains these users:', function (dataTable) {
  this.userList = dataTable.hashes();
  const { stubDbUserGetByEmail } = this;
  stubDbUserGetByEmail.resolves(null);
  this.userList.forEach(function (user) {
    stubDbUserGetByEmail.withArgs(user.email).resolves(new DbUserModel(user));
  });
  this.userList.map(
    (userInput) => {
      return Object.assign(userInput, { score: 0, _id: mongoose.Types.ObjectId(), createdAt: '2018-11-12T22:51:02.551Z', updatedAt: '2018-11-12T22:51:02.551Z', __v: 0 });
    }
  );
  this.stubDbUserList.resolves(this.userList);
    
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
    let [ user ] = users;
    user.score = Number.parseInt(user.score, 10);
    const UserMapper = require('src/infrastructure/repository/user/MongoUserMapper');
    sinon.assert.calledWith(this.spySuccess, UserMapper.toEntity(user));
  }
});
Then('I get a {string} error', function (errorMessage) {
  const [ errorThrown ] = this.spyValidationError.lastCall.args;
  expect(errorThrown).to.be.a('Error');
  expect(errorThrown.message).to.equal(repositoryErrors.types.validationError);
  expect(errorThrown.details).to.deep.equal({ message: errorMessage });
});

// Clean
After({ tags: '@app and @user' }, function () {
  sinon.reset();
  this.spySuccess = null;
  this.spyError = null;
  this.spyValidationError = null;

  this.stubDbUserSave.restore();
  this.stubDbUserRemove.restore();
  this.stubDbUserExists.restore();
  this.stubDbUserGetByEmail.restore();
  this.stubDbUserGetByEmail.restore();
  this.stubDbUserList.restore();
});