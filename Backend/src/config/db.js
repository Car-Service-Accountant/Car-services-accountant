const mongoose = require('mongoose');

const dbConfig = () => {
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.set('strictQuery', false)
  mongoose.connect("mongodb://localhost:27017/Car-sercvices-DB", options);
  
}

module.exports = dbConfig