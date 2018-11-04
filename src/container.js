const { createContainer, Lifetime, asFunction, asClass, asValue } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('../config');
const Application = require('./app/Application');
const {
  CreateUser,
  GetAllUsers,
  UpdateUser,
  GetByEmail,
  DeleteUser,
} = require('./app/user');

const UserSerializer = require('./interfaces/http/controller/user/UserSerializer');

const Server = require('./interfaces/http/Server');
const router = require('./interfaces/http/router');
const loggerMiddleware = require('./interfaces/http/logging/loggerMiddleware');
const errorHandler = require('./interfaces/http/errors/errorHandler');
const devErrorHandler = require('./interfaces/http/errors/devErrorHandler');
const swaggerMiddleware = require('./interfaces/http/swagger/swaggerMiddleware');

const MongoUsersRepository = require('./infrastructure/repository/user/MongoUsersRepository');

const { DbUser: DbUserModel } = require('./infrastructure/database/models');

const logger = require('./infrastructure/logging/logger');

const database = require('./infrastructure/mongoose');

const container = createContainer();

container.register({
  // System
  app: asClass(Application, { lifetime: Lifetime.SINGLETON }),
  server: asClass(Server, { lifetime: Lifetime.SINGLETON }),
  
  router: asFunction(router, { lifetime: Lifetime.SINGLETON }),
  logger: asFunction(logger, { lifetime: Lifetime.SINGLETON }),

  config: asValue(config),

  //Middlewares
  loggerMiddleware: asFunction(loggerMiddleware, { lifetime: Lifetime.SINGLETON }),
  containerMiddleware: asValue(scopePerRequest(container)),
  errorHandler: asValue(config.production ? errorHandler : devErrorHandler),
  swaggerMiddleware: asValue(swaggerMiddleware),


  //Repositories
  usersRepository: asClass(MongoUsersRepository, { lifetime: Lifetime.SINGLETON }),

  //Database
  database: asFunction(database),
  DbUserModel: asValue(DbUserModel),

  //Operations
  createUser: asClass(CreateUser),
  getAllUsers: asClass(GetAllUsers),
  updateUser: asClass(UpdateUser),
  getUserByEmail: asClass(GetByEmail),
  deleteUser: asClass(DeleteUser),

  //Serializer
  userSerializer: asValue(UserSerializer)
});

module.exports = container;