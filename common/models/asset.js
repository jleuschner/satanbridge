
module.exports = function (Asset) {
	var PSCommand = require('../../modules/pscommand');

	Asset.on('dataSourceAttached', function (obj) {

		var findById = Asset.findById;
		Asset.findById = function (Id, filter, cb) {
			if (isNaN(Id)) {
				//console.log("ByName!");
				return Asset.findOne.call(this, { where: { hostname: Id} }, arguments[arguments.length - 1]);
			} else {
				return findById.apply(this, arguments);
			}
		};
	})

	Asset.nslookup = function (Id, reverse, cb) {
		PSCommand.execute("ResolveDnsName", { "name": Id },
					function (error, result) {
							cb(error, result.output);
					});

		/*
		Asset.findById(Id, function (err, obj) {
		if (!obj) {
		obj = { error: { name: "Error", status: 404, statusCode: 404, message: "Unknown Asset '" + Id + "'", code: "MODEL_NOT_FOUND"} };
		cb(null, obj);
		} else {
		PSnslookup(reverse ? obj.ip : obj.hostname + "gg", function (err, out) {
		console.log(err);
		cb(err, JSON.parse(out));
		})
		}
		});
		*/
	};

	Asset.remoteMethod(
        'nslookup',
        {
        	http: { path: '/:id/nslookup', verb: 'get' },
        	accepts: [{ arg: 'id', type: 'string', http: { source: 'path' }, required: true },
										{ arg: 'reverse', type: 'boolean'}],
        	returns: { type: 'object', root: true }
        }
    );


	Asset.getName = function (Id, cb) {
		Asset.findById(Id, function (err, obj) {
			if (!obj) obj = { error: { name: "Error", status: 404, statusCode: 404, message: "Unknown Asset '" + Id + "'", code: "MODEL_NOT_FOUND"} };
			cb(err, obj);
		});
	};

	Asset.remoteMethod(
        'getName',
        {
        	http: { path: '/:id/getname', verb: 'get' },
        	accepts: { arg: 'id', type: 'string', http: { source: 'path' }, required: true },
        	//returns: { arg: 'name', type: 'string' }
        	returns: { type: 'object', root: true }
        }
    );
};
