module.exports = function(Jlpc) {
	Jlpc.on('dataSourceAttached', function(obj){
		Jlpc.find = function(filter,cb) {
			cb(null,["JENS"]);
		};
	})
};
