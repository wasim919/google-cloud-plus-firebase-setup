const app = require('./app');
const { PORT } = require('./core/constants.env');

const port = PORT;
app.listen(port, () => {
	/* eslint-disable no-console */
	console.log(`Listening: http://localhost:${port}`);
	/* eslint-enable no-console */
});
