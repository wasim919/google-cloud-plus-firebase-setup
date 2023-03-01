const { NODE_ENV } = require('./core/constants.env');

function notFound(req, res, next) {
	res.status(404);
	const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
	next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
	/* eslint-enable no-unused-vars */
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: NODE_ENV === 'production' ? '🥞' : err.stack
	});
}

module.exports = {
	notFound,
	errorHandler
};
