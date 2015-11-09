
//var edge = require('edge');
//var printer = edge.func('ps', function () {/*
//"$(Get-printer -computername print | sort name | convertto-json)"
//*/});

/*
module.exports = function (Jlpq) {
	Jlpq.getQueues = function (cb) {
		printer({}, function (error, result) {
			if (error) throw error;
			var Qs = JSON.parse(result[0]);
			Qs.forEach(function (k, v) {
				delete k.CimClass;
				delete k.CimInstanceProperties;
				delete k.CimSystemProperties;
				//console.log(k.Name);
			});
			cb(null, Qs);
		});
	};



	Jlpq.remoteMethod(
		'getQueues', {
			http: { path: '/getQueues', verb: 'get' },
			returns: { type: 'array', root: true }
		}
	)

};
*/