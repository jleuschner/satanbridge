module.exports = function (AdComputer) {
	var PSCommand = require('../../modules/pscommand');

	// ------------- find ----------------------
	AdComputer.find = function (filter, properties, cb) {
		PSCommand.execute("getADComputer", { "filter": filter, "properties": properties },
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

	AdComputer.remoteMethod(
        'find',
        {
        	http: { path: '/', verb: 'get' },
        	accepts: [{ arg: 'filter', type: 'string', required: true },
										{ arg: 'properties', type: 'string'}],
        	returns: { type: 'array', root: true }
        }
    );
	// ----------------- ENDE find -----------------

	// ----------------- findById ------------------
	AdComputer.findById = function (Id, properties, cb) {
		AdComputer.find("{ name -eq '" + Id + "' }", properties, function (error, result) {
			if (result.length) {
				result = result[0];
			} else {
				result = {};
			};
			cb(error, result);
		})
	};

	AdComputer.remoteMethod(
        'findById',
        {
        	http: { path: '/:id/', verb: 'get' },

        	accepts: [{ arg: 'id', type: 'string', http: { source: 'path' }, required: true },
										{ arg: 'properties', type: 'string'}],
        	returns: { type: 'object', root: true }
        }
    );
	// ----------------- ENDE findById --------------

	// ----------------- software ------------------
	AdComputer.software = function (Id, cb) {
		PSCommand.execute("getSmsSoftware", { "computername": Id },
					function (error, result) {
						//out = { software: result };
						cb(error, result.output);
					});
	};

	AdComputer.remoteMethod(
        'software',
        {
        	http: { path: '/:id/software/', verb: 'get' },
        	accepts: [{ arg: 'id', type: 'string', http: { source: 'path' }, required: true}],
        	returns: { type: 'array', root: true }
        }
    );
	// ----------------- ENDE software --------------

	// ----------------- ping ------------------
	AdComputer.ping = function (Id, cb) {
		PSCommand.execute("TestConnection", { "computername": Id },
					function (error, result) {
						out = { ping: result.stdout == "true" };
						cb(error, out);
					});
	};

	AdComputer.remoteMethod(
        'ping',
        {
        	http: { path: '/:id/ping/', verb: 'get' },
        	accepts: [{ arg: 'id', type: 'string', http: { source: 'path' }, required: true}],
        	returns: { type: 'object', root: true }
        }
    );
	// ----------------- ENDE ping --------------

	// ----------------- nslookup ------------------
	AdComputer.nslookup = function (Id, cb) {
		PSCommand.execute("ResolveDnsName", { "name": Id },
				function (error, result) {
					//out = { ping: result.stdout == "true" };
					if (result.stdout) {
						result.stdout = JSON.parse(result.stdout);
						if (!Array.isArray(result.stdout)) result.stdout = Array(result.stdout);
					} else {
						result.stdout = [];
					}
					cb(error, result.stdout);
				});
	};

	AdComputer.remoteMethod(
        'nslookup',
        {
        	http: { path: '/:id/nslookup/', verb: 'get' },
        	accepts: [{ arg: 'id', type: 'string', http: { source: 'path' }, required: true}],
        	returns: { type: 'array', root: true }
        }
    );
	// ----------------- ENDE nslookup --------------

	// ----------------- updates ------------------
	AdComputer.updates = function (Id, cb) {
		PSCommand.execute("getMissingUpdates", { "computername": Id },
				function (error, result) {
					//out = { ping: result.stdout == "true" };
					if (result.stderr) {
						cb(error, { error: result.stderr })
					} else {
						if (result.stdout) {
							result.stdout = JSON.parse(result.stdout);
							if (!Array.isArray(result.stdout)) result.stdout = Array(result.stdout);
						} else {
							result.stdout = [];
						}
						cb(error, { updates : result.stdout });
					}
				});
	};

	AdComputer.remoteMethod(
        'updates',
        {
        	http: { path: '/:id/updates/', verb: 'get' },
        	accepts: [{ arg: 'id', type: 'string', http: { source: 'path' }, required: true}],
        	returns: { type: 'object', root: true }
        }
    );
	// ----------------- ENDE updates --------------

	// ----------------- updates/count ------------------
	AdComputer.updatescount = function (Id, cb) {
		PSCommand.execute("getUpdatesCount", { "computername": Id },
				function (error, result) {
					if (result.stderr) {
						cb(error, { error: result.stderr })
					} else {
						result.stdout = JSON.parse(result.stdout);
						cb(error, { updates : result.stdout.Count });
					}
				});
	};

	AdComputer.remoteMethod(
        'updatescount',
        {
        	http: { path: '/:id/updates/count', verb: 'get' },
        	accepts: [{ arg: 'id', type: 'string', http: { source: 'path' }, required: true}],
        	returns: { type: 'object', root: true }
        }
    );
	// ----------------- ENDE updates --------------

};

