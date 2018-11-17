const { Before, When, After } = require('cucumber');

const UpdateUser = require('src/app/user/UpdateUser');
const MongoUserRepository = require('src/infrastructure/repository/user/MongoUsersRepository');
const DbUserModel = require('src/infrastructure/database/models/DbUser');
const usersRepository = new MongoUserRepository({ DbUserModel });
const updateUser = new UpdateUser({ usersRepository });
const { SUCCESS, ERROR, VALIDATION_ERROR } = updateUser.outputs;

// Prepare
Before({ tags: "@app and @user and @updateUser" }, function () {
    updateUser.on(SUCCESS, this.spySuccess);
    updateUser.on(ERROR, this.spyError);
    updateUser.on(VALIDATION_ERROR, this.spyValidationError);
});

// Act
When('I update user with:', async function (dataTable) {
    const users = dataTable.hashes();
    const updatedUser = users[0];
    const stubDbUserSave = this.stubDbUserSave;
    this.userList.forEach(function (user) {
        if( user.email === updatedUser.email ){
            user.lastname = updatedUser.lastname;
            user.firstname = updatedUser.firstname;
            stubDbUserSave.resolves(new DbUserModel(user));
        }
    });
    await updateUser.execute(users[0]);
});

// Assert

// Clean
After({ tags: "@app and @user and @updateUser" }, function () {
    updateUser.removeAllListeners(SUCCESS);
    updateUser.removeAllListeners(ERROR);
    updateUser.removeAllListeners(VALIDATION_ERROR);
})