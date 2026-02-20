const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ status: "success", message: "Endpoint usuarios" });
});

module.exports = router;
