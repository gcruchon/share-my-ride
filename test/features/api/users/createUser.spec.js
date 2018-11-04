const request = require('test/support/request');
const emptyDatabase = require('test/support/empty-database');
const { expect } = require('chai');

const testUser = {
  email: "test@test.com",
  lastname: "LASTNAME_TEST",
  firstname: "Firstname_TEST"
};

before(async () => {
  await emptyDatabase();
});

describe('API :: POST /api/users', () => {
  context('when sent data is ok', () => {
    it('creates and returns 201 and the new user', async () => {
      const { body, req } = await request()
        .post('/api/users')
        .send(testUser)
        .expect(201);

      expectedResponse = Object.assign(testUser, { score: 0 });
      expect(body).to.deep.equal(expectedResponse);
    });
  });

  context('when duplicated user', () => {
    it('does not create and returns 400 with the validation error', async () => {
      const { body, req } = await request()
        .post('/api/users')
        .send(testUser)
        .expect(400);
      expect(body.type).to.equal('ValidationError');
      expect(body.details.message).to.equal('User already exist');
    });
  });

  context('when email is missing', () => {
    it('does not create and returns 400 with the validation error', async () => {
      let { email, ...testUserWIthoutEmail } = testUser;
      const { body } = await request()
        .post('/api/users')
        .send(testUserWIthoutEmail)
        .expect(400);
      expect(body.type).to.equal('ValidationError');
      expect(body.details[0].message).to.equal('"email" is required');
    });
  });
});