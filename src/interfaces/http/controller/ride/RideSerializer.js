const RideSerializer = {
  serialize({ driver, passengers, date }) {
    return {
      driver,
      passengers,
      date
    };
  }
};

module.exports = RideSerializer;
