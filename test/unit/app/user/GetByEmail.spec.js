const sinon = require('sinon');

const GetByEmail = require('src/app/user/GetByEmail');

describe('App :: user :: GetByEmail', () => {
  context('when repository throws an error (but not a ValidationError)', () => {
    it('should trigger an ERROR event', async () => {
      const error = new Error('DummyError');
      const usersRepository = {
        getUserByEmail() {
          throw error;
        }
      };
      const repositoryErrors = require('src/infrastructure/repository/Errors');
      const getByEmail = new GetByEmail({ usersRepository, repositoryErrors });
      const [ SUCCESS, ERROR, VALIDATION_ERROR ] = getByEmail.outputs;
      const spySuccess = sinon.spy();
      const spyError = sinon.spy();
      const spyValidationError = sinon.spy();
            
      getByEmail.on(SUCCESS, spySuccess);
      getByEmail.on(ERROR, spyError);
      getByEmail.on(VALIDATION_ERROR, spyValidationError);

      await getByEmail.execute('gilles.cruchon@gmail.com');

      sinon.assert.notCalled(spySuccess);
      sinon.assert.notCalled(spyValidationError);
      sinon.assert.calledOnce(spyError);
      sinon.assert.calledWith(spyError, error);
    });
  });

});