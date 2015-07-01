module.exports = function (Department) {
	Department.getHosts = function (cb) {
		Department.find({
			include: { "relation" :"Assets", 
								 'scope': {
									 'where': { 'geraet': { 'like': "pc_%"}, status: {like : 'ausgeliefert'}, hostname: { nlike: "" } },
									 'fields' : ['hostname','invOs','standort','typ','status','benutzer']
									}
							 } 
							}, 
							function (err, list) {
								cb(null, list);
							})
	};

	Department.remoteMethod(
		'getHosts', {
			http: { path: '/getHosts', verb: 'get' },
			returns: { type: 'array', root: true }
		}
	)


	Department.getWorklist = function (cb) {
		Department.find({
			include: { "relation" :"Assets", 
								 'scope': {
									 'where': { 'geraet': { 'like': "pc_%"}, status: {like : 'ausgeliefert'}, hostname: { nlike: "" }, invOs: { like: "%Windows XP%"} , benutzer: { nlike: "" }},
									 'fields' : ['hostname','invOs','standort','typ','status','benutzer']
									}
							 } 
							}, 
							function (err, list) {
								cb(null, list);
							})
	};

	Department.remoteMethod(
		'getWorklist', {
			http: { path: '/getWorklist', verb: 'get' },
			returns: { type: 'array', root: true }
		}
	)



};
