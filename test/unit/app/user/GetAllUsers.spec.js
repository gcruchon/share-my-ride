const sinon = require('sinon');

const GetAllUsers = require('src/app/user/GetAllUsers');

describe('App :: user :: GetAllUsers', () => {
    context('when repository throws an error (but not a ValidationError)', () => {
        it('should trigger an ERROR event', async () => {
            const error = new Error('DummyError');
            const usersRepository = {
                getAll() {
                    throw error;
                }
            }
            const getAllUsers = new GetAllUsers({ usersRepository });
            const { SUCCESS, ERROR } = getAllUsers.outputs;
            const spySuccess = sinon.spy();
            const spyError = sinon.spy();
            
            getAllUsers.on(SUCCESS, spySuccess);
            getAllUsers.on(ERROR, spyError);

            await getAllUsers.execute();

            sinon.assert.notCalled(spySuccess);
            sinon.assert.calledOnce(spyError);
            sinon.assert.calledWith(spyError, error);
        });
    });

});