module.exports = function (AdUser) {
	var PSCommand = require('../../modules/pscommand');

	AdUser.find = function (filter, reverse, cb) {
		PSCommand.execute("getADUser", { "filter": filter },
					function (error, result) {
						if (!result.stdout) {
							result.stdout = [];
						} else {
							result.stdout = JSON.parse(result.stdout);
							if (!Array.isArray(result.stdout)) result.stdout = Array(result.stdout);
						}
						cb(error, result.stdout);
					});
	};

	AdUser.remoteMethod(
        'find',
        {
        	http: { path: '/', verb: 'get' },
        	accepts: [{ arg: 'filter', type: 'string', required: true },
										{ arg: 'properties', type: 'string'}],
        	returns: { type: 'array', root: true }
        }
    );

};
