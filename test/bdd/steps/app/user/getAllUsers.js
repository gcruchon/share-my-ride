const { Before, Given, Then, When, After } = require('cucumber');
const sinon = require('sinon');
const mongoose = require('mongoose');

const GetAllUsers = require('src/app/user/GetAllUsers');
const MongoUserRepository = require('src/infrastructure/repository/user/MongoUsersRepository');
const DbUserModel = require('src/infrastructure/database/models/DbUser');
const usersRepository = new MongoUserRepository({ DbUserModel });
const getAllUser = new GetAllUsers({ usersRepository });
const { SUCCESS, ERROR } = getAllUser.outputs;

// Prepare
Before({ tags: "@app and @user and @getAll" }, function () {
    getAllUser.on(SUCCESS, this.spySuccess);
    getAllUser.on(ERROR, this.spyError);
    this.stubDbUserList = sinon.stub(DbUserModel, 'list');
});

// Arrange
Given('the system does not contain any users', function () {
    this.userList = [];
    this.stubDbUserList.resolves([]);
});
Given('the system contains these users:', function (dataTable) {
    this.userList = dataTable.hashes();
    const mockUserList = this.userList.map(
        (userInput) => {
            return Object.assign(userInput, { score: 0, _id: mongoose.Types.ObjectId(), createdAt: "2018-11-12T22:51:02.551Z", updatedAt: "2018-11-12T22:51:02.551Z", __v: 0 });
        }
    );
    this.stubDbUserList.resolves(mockUserList);
});

// Act
When('I get all users', async function () {
    await getAllUser.execute();
});

// Assert
Then('I get an empty list of users', function () {
    sinon.assert.calledWith(this.spySuccess, []);
});
Then('I get these users:', function (dataTable) {
    const users = dataTable.hashes();
    const UserMapper = require('src/infrastructure/repository/user/MongoUserMapper');
    sinon.assert.calledWith(this.spySuccess, users.map(UserMapper.toEntity));
});

// Clean
After({ tags: "@app and @user and @getAll" }, function () {
    getAllUser.removeAllListeners(SUCCESS);
    getAllUser.removeAllListeners(ERROR);
    this.stubDbUserList.restore();
})