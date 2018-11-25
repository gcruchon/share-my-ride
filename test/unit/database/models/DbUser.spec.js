const { expect } = require('chai');
const sinon = require('sinon');
const DbUser = require('src/infrastructure/database/models/DbUser');

describe('Infra :: Database :: Models', () => {
  describe('DbUser - middleware', () => {
    describe('errorMessageTransformer', () => {
      it('should transform a 11000 error', (done) => {
        const inputError = new Error('MongoError');
        inputError.code = 11000;

        const next = sinon.spy();

        DbUser.errorMessageTransformer(inputError, {}, next);

        sinon.assert.calledOnce(next);
        const [errorThrown] = next.lastCall.args;
        expect(errorThrown).to.be.an('Error');
        expect(errorThrown.message).to.equal('ValidationError');
        expect(errorThrown.details).to.equal('Duplicate found');
        done();
      });

      it('should not transform any error other than a 11000 error', (done) => {
        const inputError = new Error('MongoError');
        inputError.code = 42;

        const next = sinon.spy();

        DbUser.errorMessageTransformer(inputError, {}, next);

        sinon.assert.calledOnce(next);
        sinon.assert.calledWith(next, inputError);
        done();
      });
    });
  });
  describe('DbUser', () => {
    it('should be valid if all is OK', (done) => {
      const validUser = new DbUser({ _id: 'gilles.cruchon@gmail.com', lastname: 'CRUCHON', firstname: 'Gilles' });
      const error = validUser.validateSync();
      expect(error).to.be.undefined;
      done();
    });

    it('should be invalid if email is empty', (done) => {
      const invalidUser = new DbUser({ lastname: 'CRUCHON', firstname: 'Gilles' });
      const error = invalidUser.validateSync();
      expect(error.name).to.equal('ValidationError');
      expect(error.errors).to.exist;
      expect(error.errors.email).to.exist;
      done();
    });

    it('should be invalid if email is in the wrong format', (done) => {
      const invalidUser = new DbUser({ _id: 'toto', lastname: 'CRUCHON', firstname: 'Gilles' });
      const error = invalidUser.validateSync();
      expect(error.name).to.equal('ValidationError');
      expect(error.errors).to.exist;
      expect(error.errors.email).to.exist;
      done();
    });

    it('should be invalid if lastname is empty', (done) => {
      const invalidUser = new DbUser({ _id: 'gilles.cruchon@gmail.com', firstname: 'Gilles' });
      const error = invalidUser.validateSync();
      expect(error.name).to.equal('ValidationError');
      expect(error.errors).to.exist;
      expect(error.errors.lastname).to.exist;
      done();
    });

    it('should be invalid if firstname is empty', (done) => {
      const invalidUser = new DbUser({ _id: 'gilles.cruchon@gmail.com', lastname: 'CRUCHON' });
      const error = invalidUser.validateSync();
      expect(error.name).to.equal('ValidationError');
      expect(error.errors).to.exist;
      expect(error.errors.firstname).to.exist;
      done();
    });

    it('should fetch user by email', async () => {
      const expectedUser = new DbUser({ _id: 'gilles.cruchon@gmail.com', lastname: 'CRUCHON', firstname: 'Gilles' });
      const findOneStub = sinon.stub(DbUser, 'findOne').resolves(expectedUser);

      const result = await DbUser.getByEmail('gilles.cruchon@gmail.com');
      sinon.assert.calledOnce(findOneStub);
      sinon.assert.calledWith(findOneStub, { _id: 'gilles.cruchon@gmail.com' });
      expect(result).to.equal(expectedUser);
      findOneStub.restore();
    });

    it('should check if a user exists', async () => {
      const expectedUser = new DbUser({ _id: 'gilles.cruchon@gmail.com', lastname: 'CRUCHON', firstname: 'Gilles' });
      const mockFindOne = {
        exec: async () => {
          return expectedUser;
        }
      };
      const findOneStub = sinon.stub(DbUser, 'findOne').returns(mockFindOne);

      const result = await DbUser.exist('gilles.cruchon@gmail.com');
      sinon.assert.calledOnce(findOneStub);
      sinon.assert.calledWith(findOneStub, { _id: 'gilles.cruchon@gmail.com' });
      expect(result).to.equal(true);
      findOneStub.restore();
    });

    it('should check if a user does not exists', async () => {
      const mockFindOne = {
        exec: async () => {
          return null;
        }
      };
      const findOneStub = sinon.stub(DbUser, 'findOne').returns(mockFindOne);

      const result = await DbUser.exist('gilles.cruchon@gmail.com');
      sinon.assert.calledOnce(findOneStub);
      sinon.assert.calledWith(findOneStub, { _id: 'gilles.cruchon@gmail.com' });
      expect(result).to.equal(false);
      findOneStub.restore();
    });

    it('should list users', async () => {
      const expectedUsers = [
        { _id: 'user1@gmail.com', lastname: 'USER', firstname: 'One' },
        { _id: 'user2n@gmail.com', lastname: 'USER', firstname: 'Two' }
      ];
      const exec = sinon.stub().resolves(expectedUsers);
      const limit = sinon.stub().returns({ exec });
      const skip = sinon.stub().returns({ limit });
      const sort = sinon.stub().returns({ skip });
      const find = sinon.stub(DbUser, 'find').returns({ sort });

      const result = await DbUser.list();
      sinon.assert.calledOnce(find);
      sinon.assert.calledOnce(sort);
      sinon.assert.calledWith(sort, { createdAt: -1 });
      sinon.assert.calledOnce(skip);
      sinon.assert.calledWith(skip, 0);
      sinon.assert.calledOnce(limit);
      sinon.assert.calledWith(limit, 50);
      sinon.assert.calledOnce(exec);
      expect(result).to.equal(expectedUsers);
      find.restore();
    });
  });
});