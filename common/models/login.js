module.exports = function(Login) {

	Login.byHost = function (host,cb) {
		Login.find({
				 'where': { 'hostname': host}
							}, 
							function (err, list) {
								cb(null, list);
							})
	};

	Login.remoteMethod(
		'byHost', {
			http: { path: '/byHost', verb: 'get' },
			accepts: { arg : 'host', type : 'string', required:true },
			returns: { type: 'array', root: true }
		}
	)


};
