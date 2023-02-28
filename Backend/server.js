const express = require('express');
const app = express();
const dbConfig = require('./src/config/configDataBase');
const router = require('./src/routes');

const PORT = process.env.PORT || 3000;

dbConfig();

app.use(router)
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});