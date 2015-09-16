module.exports = function (Pc) {

	Pc.on('dataSourceAttached', function (obj) {
		var find = Pc.find;
		Pc.find = function (filter, cb) {
			if (filter === undefined) filter = {};
			//filter.limit = 5;
			if (filter.where === undefined) filter.where = {};
			if (filter.where.geraet === undefined) filter.where.geraet = {};
			filter.where.geraet.like = "pc_%";
			console.log(filter);
			return find.apply(this, arguments);
		};
	})

};
