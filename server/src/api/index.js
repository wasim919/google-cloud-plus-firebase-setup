const express = require('express');

const google = require('./google');

const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		message: 'API - 👋🌎🌍🌏'
	});
});

router.use('/google', google);

module.exports = router;
