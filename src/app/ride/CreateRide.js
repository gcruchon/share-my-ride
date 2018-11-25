const Operation = require('../Operation');
const Ride = require('../../domain/ride/Ride');

class CreatRide extends Operation {
  constructor({ ridesRepository, usersRepository }) {
    super();
    this.ridesRepository = ridesRepository;
    this.usersRepository = usersRepository;
  }

  async execute({ driver, passengers, date }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;

    const driverUser = await this.usersRepository.getUserByEmail(driver);

    const { usersRepository } = this;
    const passengerUserPromises = passengers.map(async (passengerEmail) => await usersRepository.getUserByEmail(passengerEmail));
    const passengerUsers = await Promise.all(passengerUserPromises);

    // Everything goes to repository must become Entity first
    const ride = new Ride({ driver: driverUser, passengers: passengerUsers, date });

    try {
      const newRide = await this.ridesRepository.add(ride);

      this.emit(SUCCESS, newRide);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreatRide.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = CreatRide;
