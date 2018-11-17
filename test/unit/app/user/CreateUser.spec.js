const { expect } = require('chai');
const sinon = require('sinon');

const CreateUser = require('src/app/user/CreateUser');

describe('App :: user :: CreateUser', () => {
    context('when repository has an error (but not a ValidationError)', () => {
        it('should trigger an ERROR event', async () => {
            const error = new Error('DummyError');
            const usersRepository = {
                add() {
                    throw error;
                }
            }
            const createUser = new CreateUser({ usersRepository });
            const { SUCCESS, ERROR, VALIDATION_ERROR } = createUser.outputs;
            const spySuccess = sinon.spy();
            const spyError = sinon.spy();
            const spyValidationError = sinon.spy();

            const user = { email: "gilles.cruchon@gmail.com", lastname: "CRUCHON", firstname: "Gilles" };
            
            createUser.on(SUCCESS, spySuccess);
            createUser.on(ERROR, spyError);
            createUser.on(VALIDATION_ERROR, spyValidationError);

            await createUser.execute(user);

            sinon.assert.notCalled(spySuccess);
            sinon.assert.notCalled(spyValidationError);
            sinon.assert.calledOnce(spyError);
            sinon.assert.calledWith(spyError, error);

            expect(() => {
                operation.on(operation.outputs.SUCCESS, () => { });
            }).to.not.throw;
        });
    });

});