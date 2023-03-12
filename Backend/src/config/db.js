const { MongoClient, ServerApiVersion } = require ('mongodb-legacy');

const dbConfig = () => {
  const client = new MongoClient("mongodb+srv://admin:purpleechip0123456@carservicedb.ehxjt4o.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  client.connect((err) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
    } else {
      console.log('Connected to MongoDB successfully');
      const collection = client.db("test").collection("devices");
      client.close();
    }
  });
}

module.exports = dbConfig