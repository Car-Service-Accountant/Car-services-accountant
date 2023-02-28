const mongoose = require('mongoose');

//TODO: make different location of DB after project is ready to be imployed
const configMongoose = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://localhost:27017/Petstagram')
}

module.exports = configMongoose 