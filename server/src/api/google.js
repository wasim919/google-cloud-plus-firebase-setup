const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.json(['😀', '😳', '🙄']);
});

router.get('/redirect', (req, res) => {
	res.json(['😀', '😳', '🙄']);
});

module.exports = router;
