const router = require('express').Router();




router.all('*', (req, res) => {
    res.send("cusstom there")
})


module.exports = router