const Ride = require('../../../domain/ride/Ride');
const User = require('../../../domain/user/User');

const MongoRideMapper = {
  toEntity(dataValues) {
    const { driver, passengers, date } = dataValues;

    return new Ride({
      driver: new User(driver),
      passengers: passengers.map(passenger => new User(passenger)),
      date
    });
  },

  toDatabase(survivor) {
    const { driver: driverUser, passengers: passengerUsers, date } = survivor;

    const driver = driverUser.email;
    const passengers = passengerUsers.map(user => user.email);

    return { driver, passengers, date };
  }
};

module.exports = MongoRideMapper;