const RideMapper = require('./MongoRideMapper');
const Errors = require('../Errors');


class MongoRideRepository {

  constructor({ DbRideModel }) {
    this.DbRideModel = DbRideModel;
  }

  // RULES IN AS ENTITY --- OUT AS ENTITY
  async add(ride) {
    // Validate and check user existance throw error if any
    await this._validate(ride);

    //1. Before save to database conver data from entity structure to database structure using same folder mapper
    const DbRide = new this.DbRideModel(RideMapper.toDatabase(ride));
    const newDbRide = await DbRide.save();

    // 2 After getting the newly saved date from database convert the result back as enitity
    return RideMapper.toEntity(newDbRide);

  }

  //Private functions
  async _validate(ride) {
    //We could call validate because of 'structure' library we defined as domain
    const { valid, errors } = ride.validate();

    if (!valid) {
      const error = new Error(Errors.types.validationError);
      error.details = errors;
      throw error;
    }
  }

}

module.exports = MongoRideRepository;
