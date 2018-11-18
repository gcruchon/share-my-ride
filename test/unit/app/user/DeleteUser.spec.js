const sinon = require('sinon');

const DeleteUser = require('src/app/user/DeleteUser');

describe('App :: user :: DeleteeUser', () => {
    context('when repository throws an error (but not a ValidationError)', () => {
        it('should trigger an ERROR event', async () => {
            const error = new Error('DummyError');
            const usersRepository = {
                remove() {
                    throw error;
                }
            }
            const deleteUser = new DeleteUser({ usersRepository });
            const { SUCCESS, ERROR, VALIDATION_ERROR } = deleteUser.outputs;
            const spySuccess = sinon.spy();
            const spyError = sinon.spy();
            const spyValidationError = sinon.spy();
            
            deleteUser.on(SUCCESS, spySuccess);
            deleteUser.on(ERROR, spyError);
            deleteUser.on(VALIDATION_ERROR, spyValidationError);

            await deleteUser.execute("gilles.cruchon@gmail.com");

            sinon.assert.notCalled(spySuccess);
            sinon.assert.notCalled(spyValidationError);
            sinon.assert.calledOnce(spyError);
            sinon.assert.calledWith(spyError, error);
        });
    });

});