const request = require('test/support/request');
const emptyDatabase = require('test/support/empty-database');
const { expect } = require('chai');

const testUser = {
  email: 'testdelete@test.com',
  lastname: 'LASTNAME_TEST',
  firstname: 'Firstname_TEST'
};

before(async () => {
  await emptyDatabase();
  await request()
    .post('/api/users')
    .send(testUser);
});

after(async () => {
  await emptyDatabase();
});

describe('API :: DELETE /api/users', () => {
  context('when sent data is ok', () => {
    it('creates and returns 200 and the deleted user', async () => {
      const { body } = await request()
        .delete('/api/users/' + testUser.email)
        .expect(200);

      const expectedResponse = Object.assign(testUser, { score: 0 });
      expect(body).to.deep.equal(expectedResponse);
    });
  });

  context('when user does not exist', () => {
    it('returns 404 with the validation error', async () => {
      const { body } = await request()
        .delete('/api/users/' + testUser.email)
        .expect(404);
      expect(body.type).to.equal('ValidationError');
      expect(body.details.message).to.equal('User not found');
    });
  });

});