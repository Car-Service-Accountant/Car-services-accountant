const express = require('express');
const cors = require('./src/middleware/cors');
const dbConfig = require('./src/config/db');

const auth = require('./src/middleware/authMiddleware');

const PORT = 3000;

dbConfig();
start()

async function start() {

    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(auth());
    app.use(express.static('public'));

    app.get(`/`, (req, res) => res.json({ messsage: 'REST Services operational' }))

    app.listen(PORT, () => console.log('Server work right'));

}
