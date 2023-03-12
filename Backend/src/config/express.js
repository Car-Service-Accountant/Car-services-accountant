module.exports = (app, express) => {
  app.use(express.static('public'));
  app.use(express.json());

  app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500).json({ message: error.message || 'An unknown error occurred!' });
  });
};
z