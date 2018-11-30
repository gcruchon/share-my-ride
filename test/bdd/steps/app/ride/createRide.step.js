const { Before, Given, When, Then, After } = require('cucumber');
const { expect } = require('chai');
const sinon = require('sinon');

const CreateRide = require('src/app/ride/CreateRide');
const MongoRideRepository = require('src/infrastructure/repository/ride/MongoRidesRepository');
const DbRideModel = require('src/infrastructure/database/models/DbRide');
const ridesRepository = new MongoRideRepository({ DbRideModel });
const UserMapper = require('src/infrastructure/repository/user/MongoUserMapper');
const repositoryErrors = require('src/infrastructure/repository/Errors');

// Prepare
Before({ tags: '@app and @ride and @create' }, function () {
  this.spySuccess = sinon.spy();
  this.spyError = sinon.spy();
  this.spyValidationError = sinon.spy();

  this.stubDbRideSave = sinon.stub(DbRideModel.prototype, 'save');


  this.getUserByEmailStub = sinon.stub();
  this.usersRepositoryStub = { getUserByEmail: this.getUserByEmailStub };
  this.createRide = new CreateRide({ ridesRepository, usersRepository: this.usersRepositoryStub, repositoryErrors });
  const { SUCCESS, ERROR, VALIDATION_ERROR } = this.createRide.outputs;

  this.createRide.on(SUCCESS, this.spySuccess);
  this.createRide.on(ERROR, this.spyError);
  this.createRide.on(VALIDATION_ERROR, this.spyValidationError);
});

// Arrange
Given('this driver exists:', function (dataTable) {
  const users = dataTable.hashes();
  if (users.length) {
    [ this.driver ] = users;
  }
  this.driver._id = this.driver.email;
  this.getUserByEmailStub.withArgs(this.driver.email).resolves(UserMapper.toEntity(this.driver));
});
Given('theses passengers exist:', function (dataTable) {
  this.passengers = dataTable.hashes();
  const { getUserByEmailStub } = this;
  this.passengers.forEach(function (user) {
    user._id = user.email;
    getUserByEmailStub.withArgs(user.email).resolves(UserMapper.toEntity(user));
  });
});
Given('the affected ride is:', function (dataTable) {
  const flatRides = dataTable.hashes();
  const rides = flatRides.map(getRideFromDataRow);

  if (rides.length) {
    [this.ride] = rides;
  }
  const mockRide = Object.assign({ _id: '5bfac879742a8b5572055f16' }, this.ride);
  if( this.driver ){
    mockRide.driver = this.driver;
  }
  if( this.passengers ){
    mockRide.passengers = this.passengers;
  }
  this.stubDbRideSave.resolves(mockRide);
});

// Act
When('I create this ride', async function () {
  await this.createRide.execute(this.ride);
});

// Assert
Then('I get the ride', function (dataTable) {
  const expectedRides = dataTable.hashes();
  if (expectedRides.length) {
    const [ expectedRide ] = expectedRides;
    const [ result ] = this.spySuccess.lastCall.args;
    expect(result).to.be.an('Object');
    expect(result.driver).to.exist;
    expect(result.driver.email).to.exist;
    expect(result.driver.email).to.equal(expectedRide.driver);
    expect(result.passengers).to.exist;
    expect(result.passengers).to.be.an('Array');
    expect(result.passengers).to.have.lengthOf.above(0);
    if( expectedRide.passenger1 ){
      expect(result.passengers[0]).to.exist;
      expect(result.passengers[0].email).to.exist;
      expect(result.passengers[0].email).to.equal(expectedRide.passenger1);
    }
    if( expectedRide.passenger2 ){
      expect(result.passengers).to.have.lengthOf.above(1);
      expect(result.passengers[1]).to.exist;
      expect(result.passengers[1].email).to.exist;
      expect(result.passengers[1].email).to.equal(expectedRide.passenger2);
    }
    if( expectedRide.passenger3 ){
      expect(result.passengers).to.have.lengthOf.above(2);
      expect(result.passengers[2]).to.exist;
      expect(result.passengers[2].email).to.exist;
      expect(result.passengers[2].email).to.equal(expectedRide.passenger3);
    }
    if( expectedRide.passenger4 ){
      expect(result.passengers).to.have.lengthOf(4);
      expect(result.passengers[3]).to.exist;
      expect(result.passengers[3].email).to.exist;
      expect(result.passengers[3].email).to.equal(expectedRide.passenger4);
    }
  }
});

// Clean

After({ tags: '@app and @ride' }, function () {
  sinon.reset();
  this.spySuccess = null;
  this.spyError = null;
  this.spyValidationError = null;

  this.stubDbRideSave.restore();
});
After({ tags: '@app and @ride and @create' }, function () {
  const { SUCCESS, ERROR, VALIDATION_ERROR } = this.createRide.outputs;
  this.createRide.removeAllListeners(SUCCESS);
  this.createRide.removeAllListeners(ERROR);
  this.createRide.removeAllListeners(VALIDATION_ERROR);
  this.createRide = null;
  this.usersRepositoryStub = null;
  this.getUserByEmailStub = null;
});

// Some utils

const getRideFromDataRow = ({ driverEmail, passenger1, passenger2, passenger3, passenger4, date }) => {
  const ride = {
    driverEmail,
    passengerEmails:[passenger1],
    date
  };
  if( passenger2 ) {
    ride.passengerEmails.push(passenger2);
  }
  if( passenger3 ) {
    ride.passengerEmails.push(passenger3);
  }
  if( passenger4 ) {
    ride.passengerEmails.push(passenger4);
  }
  return ride;
};