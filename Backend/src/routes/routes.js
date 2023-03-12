const userController = require('../controllers/user');

module.exports = (app) => {
  app.use('/auth', userController);
};
