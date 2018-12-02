const { Router } = require('express');
const { inject, makeInvoker } = require('awilix-express');
const Status = require('http-status');

const RidesController = {
  get router() {
    const router = Router();

    router.use(inject(({ rideSerializer }) => (req, res, next) => {
      req.rideSerializer = rideSerializer;
      return next();
    }));

    router.post('/', makeInvoker(this.create)('_createRide'));

    return router;
  },

  create({ createRide }) {
    return {
      _createRide: (req, res, next) => {
        const { rideSerializer } = req;
        const [ SUCCESS, ERROR, VALIDATION_ERROR ] = createRide.outputs;

        createRide
          .on(SUCCESS, (ride) => {
            res
              .status(Status.CREATED)
              .json(rideSerializer.serialize(ride));
          })
          .on(VALIDATION_ERROR, (error) => {
            res.status(Status.BAD_REQUEST).json({
              type: 'ValidationError',
              details: error.details
            });
          })
          .on(ERROR, next);

        createRide.execute(req.body);
      }
    };
  }

};

module.exports = RidesController;