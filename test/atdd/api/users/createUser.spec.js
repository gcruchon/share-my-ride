/*eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]*/
const request = require('test/support/request');
const emptyDatabase = require('test/support/empty-database');
const { expect } = require('chai');

const testUser = {
  email: 'testcreate@test.com',
  lastname: 'LASTNAME_TEST',
  firstname: 'Firstname_TEST'
};

before(async () => {
  await emptyDatabase();
});

after(async () => {
  await emptyDatabase();
});

describe('API :: POST /api/users', () => {
  context('when sent data is ok', () => {
    it('creates and returns 201 and the new user', async () => {
      const { body } = await request()
        .post('/api/users')
        .send(testUser)
        .expect(201);

      const expectedResponse = Object.assign(testUser, { score: 0 });
      expect(body).to.deep.equal(expectedResponse);
    });
  });

  context('when duplicated user', () => {
    it('does not create and returns 400 with the validation error', async () => {
      const { body } = await request()
        .post('/api/users')
        .send(testUser)
        .expect(400);
      expect(body.type).to.equal('ValidationError');
      expect(body.details.message).to.equal('User already exists');
    });
  });

  context('when email is missing', () => {
    it('does not create and returns 400 with the validation error', async () => {
      const { email, ...testUserWithoutEmail } = testUser;
      const { body } = await request()
        .post('/api/users')
        .send(testUserWithoutEmail)
        .expect(400);
      expect(body.type).to.equal('ValidationError');
      expect(body.details[0].message).to.equal('"email" is required');
    });
  });

  context('when email is in the wrong format', () => {
    it('does not create and returns 400 with the validation error', async () => {
      let { email, ...testUserWithInvalidEmail } = testUser;
      testUserWithInvalidEmail.email = 'toto';
      const { body } = await request()
        .post('/api/users')
        .send(testUserWithInvalidEmail)
        .expect(400);
      expect(body.type).to.equal('ValidationError');
      expect(body.details[0].message).to.equal('"email" must be a valid email');
    });
  });

  context('when lastname is missing', () => {
    it('does not create and returns 400 with the validation error', async () => {
      let { lastname, ...testUserWithoutLastname } = testUser;
      const { body } = await request()
        .post('/api/users')
        .send(testUserWithoutLastname)
        .expect(400);
      expect(body.type).to.equal('ValidationError');
      expect(body.details[0].message).to.equal('"lastname" is required');
    });
  });

  context('when firstname is missing', () => {
    it('does not create and returns 400 with the validation error', async () => {
      let { firstname, ...testUserWithoutFirstname } = testUser;
      const { body } = await request()
        .post('/api/users')
        .send(testUserWithoutFirstname)
        .expect(400);
      expect(body.type).to.equal('ValidationError');
      expect(body.details[0].message).to.equal('"firstname" is required');
    });
  });

  context('when several fields are missing', () => {
    it('does not create and returns 400 with the validation error and the list of missing fields', async () => {
      let { firstname, lastname, ...testUserWithMissingFields } = testUser;
      const { body } = await request()
        .post('/api/users')
        .send(testUserWithMissingFields)
        .expect(400);
      expect(body.type).to.equal('ValidationError');
      expect(body.details[0].message).to.equal('"lastname" is required');
      expect(body.details[1].message).to.equal('"firstname" is required');
    });
  });

});