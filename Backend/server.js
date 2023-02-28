const express = require('express');
const app = express();
const dbConfig = require('./src/config/configDataBase');
const router = require('./src/routes');
const cookeiParser = require('cookie-parser');
const authMiddleware = require('./src/middleware/authMiddleware');
const PORT = process.env.PORT || 3000;

dbConfig();

app.use('/static', express.static('public'));
app.use(express.urlencoded({extended: false}))
app.use(cookeiParser());
app.use(authMiddleware);
app.use(router)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});