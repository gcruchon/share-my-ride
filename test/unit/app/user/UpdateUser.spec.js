const sinon = require('sinon');

const UpdateUser = require('src/app/user/UpdateUser');

describe('App :: user :: UpdateUser', () => {
  context('when repository throws an error (but not a ValidationError)', () => {
    it('should trigger an ERROR event', async () => {
      const error = new Error('DummyError');
      const usersRepository = {
        update() {
          throw error;
        }
      };
      const repositoryErrors = require('src/infrastructure/repository/Errors');
      const updateUser = new UpdateUser({ usersRepository, repositoryErrors });
      const [ SUCCESS, ERROR, VALIDATION_ERROR ] = updateUser.outputs;
      const spySuccess = sinon.spy();
      const spyError = sinon.spy();
      const spyValidationError = sinon.spy();
            
      const user = { email: 'gilles.cruchon@gmail.com', lastname: 'CRUCHON', firstname: 'Gilles' };

      updateUser.on(SUCCESS, spySuccess);
      updateUser.on(ERROR, spyError);
      updateUser.on(VALIDATION_ERROR, spyValidationError);

      await updateUser.execute(user);

      sinon.assert.notCalled(spySuccess);
      sinon.assert.notCalled(spyValidationError);
      sinon.assert.calledOnce(spyError);
      sinon.assert.calledWith(spyError, error);
    });
  });

});