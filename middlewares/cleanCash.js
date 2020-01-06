const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
	await next();
	// after the route handler all done...
	clearHash(req.user.id);
};
