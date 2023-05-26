const mongoose = require('mongoose');

const dbConfig = () => {
  // const options = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.set('strictQuery', false)
  mongoose.connect('mongodb+srv://admin:secretsecret@carservicedb.ehxjt4o.mongodb.net/CarAccountantDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

}
module.exports = dbConfig
