const { Router } = require('express');
const { inject, makeInvoker } = require('awilix-express');
const Status = require('http-status');

const UsersController = {
  get router() {
    const router = Router();

    router.use(inject(({ userSerializer }) => (req, res, next) => {
      req.userSerializer = userSerializer;
      return next();
    }));

    router.get('/', makeInvoker(this.index)('_getAllUsers'));
    router.get('/:email', makeInvoker(this.getUserByEmail)('_getUserByEmail'));
    router.delete('/:email', makeInvoker(this.removeUser)('_deleteUser'));
    router.post('/', makeInvoker(this.create)('_createUser'));
    router.put('/', makeInvoker(this.update)('_updateUser'));

    return router;
  },

  index({ getAllUsers }) {
    return {
      _getAllUsers: (req, res, next) => {
        const { userSerializer } = req;
        const [ SUCCESS, ERROR ] = getAllUsers.outputs;

        getAllUsers
          .on(SUCCESS, (users) => {
            res
              .status(Status.OK)
              .json(users.map(userSerializer.serialize));
          })
          .on(ERROR, next);

        getAllUsers.execute();
      }
    };
  },

  getUserByEmail({ getUserByEmail }) {
    return {
      _getUserByEmail: (req, res, next) => {
        const { userSerializer } = req;
        const [ SUCCESS, ERROR, VALIDATION_ERROR ] = getUserByEmail.outputs;

        getUserByEmail
          .on(SUCCESS, (user) => {
            res
              .status(Status.OK)
              .json(userSerializer.serialize(user));
          })
          .on(VALIDATION_ERROR, (error) => {
            res.status(Status.NOT_FOUND).json({
              type: 'ValidationError',
              details: error.details
            });
          })
          .on(ERROR, next);

        getUserByEmail.execute(req.params.email);
      }
    };
  },

  removeUser({ deleteUser }) {
    return {
      _deleteUser: (req, res, next) => {
        const { userSerializer } = req;
        const [ SUCCESS, ERROR, VALIDATION_ERROR ] = deleteUser.outputs;

        deleteUser
          .on(SUCCESS, (user) => {
            res
              .status(Status.OK)
              .json(userSerializer.serialize(user));
          })
          .on(VALIDATION_ERROR, (error) => {
            res.status(Status.NOT_FOUND).json({
              type: 'ValidationError',
              details: error.details
            });
          })
          .on(ERROR, next);

        deleteUser.execute(req.params.email);
      }
    };
  },

  create({ createUser }) {
    return {
      _createUser: (req, res, next) => {
        const { userSerializer } = req;
        const [ SUCCESS, ERROR, VALIDATION_ERROR ] = createUser.outputs;

        createUser
          .on(SUCCESS, (user) => {
            res
              .status(Status.CREATED)
              .json(userSerializer.serialize(user));
          })
          .on(VALIDATION_ERROR, (error) => {
            res.status(Status.BAD_REQUEST).json({
              type: 'ValidationError',
              details: error.details
            });
          })
          .on(ERROR, next);

        createUser.execute(req.body);
      }
    };
  },

  update({ updateUser }) {
    return {
      _updateUser: (req, res, next) => {
        const { userSerializer } = req;
        const [ SUCCESS, ERROR, VALIDATION_ERROR ] = updateUser.outputs;
        updateUser
          .on(SUCCESS, (user) => {
            res
              .status(Status.OK)
              .json(userSerializer.serialize(user));
          })
          .on(VALIDATION_ERROR, (error) => {
            res.status(Status.BAD_REQUEST).json({
              type: 'ValidationError',
              details: error.details
            });
          })
          .on(ERROR, next);

        updateUser.execute(req.body);
      }
    };
  }

};

module.exports = UsersController;