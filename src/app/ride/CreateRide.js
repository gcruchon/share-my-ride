const Operation = require('../Operation');
const Ride = require('../../domain/ride/Ride');

class CreateRide extends Operation {
  constructor({ ridesRepository, usersRepository, repositoryErrors }) {
    super();
    this.ridesRepository = ridesRepository;
    this.usersRepository = usersRepository;
    this.repositoryErrors = repositoryErrors;
  }

  async execute({ driverEmail, passengerEmails, date }) {
    const [ SUCCESS, ERROR, VALIDATION_ERROR ] = this.outputs;

    const driver = await this.usersRepository.getUserByEmail(driverEmail);

    const { usersRepository } = this;
    const passengersPromises = passengerEmails.map(async (passengerEmail) => await usersRepository.getUserByEmail(passengerEmail));
    const passengers = await Promise.all(passengersPromises);

    // Everything goes to repository must become Entity first
    const ride = new Ride({ driver, passengers, date });

    try {
      const newRide = await this.ridesRepository.add(ride);

      this.emit(SUCCESS, newRide);
    } catch (error) {
      if (error.message === this.repositoryErrors.types.validationError) {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreateRide.setOutputs([Symbol('SUCCESS'), Symbol('ERROR'), Symbol('VALIDATION_ERROR')]);

module.exports = CreateRide;
