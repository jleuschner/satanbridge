module.exports = function (AdUser) {
	var PSCommand = require('../../modules/pscommand');
	var ActiveDirectory = require('activedirectory');
	var ADConfig = {
		url: 'ldap://dckdo01.kl.kdo.int',
		baseDN: 'DC=kl,DC=kdo,DC=int',
		//baseDN: 'OU=Klinikum,DC=kl,DC=kdo,DC=int',
		username: 'administrator@kl.kdo.int',
		password: ''  // Credentials für AD-Lesezugriff
		/*
		,attributes: {
		user: ['dn', 'userPrincipalName', 'DisplayName', 'extensionAttribute6']
		}
		*/
	}
	var AD = new ActiveDirectory(ADConfig);

	// /:Id   findByID
	AdUser.findById = function (Id, cb) {
		Id = Id.replace(/\*/g, "");
		AD.findUser(Id, function (err, users) {
			if (err) {
				//console.log('ERROR: ' + JSON.stringify(err));
				cb(err, null);
			} else {
				if ((!users) || (users.length == 0)) {
					cb(null, {});
				}
				else {
					cb(null, users);
				}
			}
		});
	};
	AdUser.remoteMethod('findById',
		{
			http: { path: '/:Id', verb: 'get' },
			accepts: [{ arg: 'Id', type: 'string', http: { source: 'path' }, required: true}],
			returns: { type: 'object', root: true }
		}
	);

	// /:id/authenticate   authenticate
	AdUser.authenticate = function (Id, password, cb) {
		Id = Id.replace(/\*/g, "")
		AdUser.findById(Id, function (err, user) {
			if (user.userPrincipalName) {
				AD.authenticate(user.userPrincipalName, password, function (err, auth) {
					if (err) {
						cb(null, { user: user, auth: false });
						return;
					}
					if (auth) {
						cb(err, { user: user, auth: true });
					}
					else {
						cb(err, { user: user, auth: false });
					}
				})
			} else {
				cb(null, { user: false, auth: false })
			}
		})
	};
	AdUser.remoteMethod('authenticate',
		{
			http: { path: '/:Id/authenticate/', verb: 'post' },
			accepts: [
				{ arg: 'Id', type: 'string', http: { source: 'path' }, required: true },
				{ arg: 'password', type: 'string', required: true}],
			returns: { type: 'object', root: true }
		}
	);


	// /:Id/passwd   passwd
	AdUser.passwd = function (Id, OldPassword, NewPassword, cb) {
		Id = Id.replace(/\*/g, "")
		AdUser.findById(Id, function (err, user) {
			if (user.sAMAccountName) {
				/*
				AD.authenticate(user.userPrincipalName,password, function(err,auth){
				if (err) {
				cb(null, {user: user.userPrincipalName, auth: false});
				return;
				}
				if (auth) {
				cb(err, {user: user.userPrincipalName, auth: true});
				}
				else {
				cb(err, {user: user.userPrincipalName, auth: false});
				}
				})
				*/
				PSCommand.execute("changePasswd", {
					"Identity": user.sAMAccountName,
					"OldPassword": "( convertto-securestring -string '" + OldPassword + "' -AsPlainText -Force)",
					"NewPassword": "( convertto-securestring -string '" + NewPassword + "' -AsPlainText -Force)"
				},
					function (error, result) {
						var out = {
							user: user.userPrincipalName,
							passwd: true
						}
						if (result.stderr) {
							out.passwd = false;
							out.error = result.stderr;
						}
						cb(error, out);
					});

			} else {
				cb(null, { user: false, passwd: false })
			}
		})
	};
	AdUser.remoteMethod('passwd',
		{
			http: { path: '/:Id/passwd', verb: 'post' },
			accepts: [
				{ arg: 'Id', type: 'string', http: { source: 'path' }, required: true },
				{ arg: 'OldPassword', type: 'string', required: true},
				{ arg: 'NewPassword', type: 'string', required: true}],
			returns: { type: 'object', root: true }
		}
	);


	// /:Id/setpasswd   setpasswd
	AdUser.setpasswd = function (Id, NewPassword, cb) {
		Id = Id.replace(/\*/g, "")
		AdUser.findById(Id, function (err, user) {
			if (user.sAMAccountName) {
				/*
				AD.authenticate(user.userPrincipalName,password, function(err,auth){
				if (err) {
				cb(null, {user: user.userPrincipalName, auth: false});
				return;
				}
				if (auth) {
				cb(err, {user: user.userPrincipalName, auth: true});
				}
				else {
				cb(err, {user: user.userPrincipalName, auth: false});
				}
				})
				*/
				PSCommand.execute("setPasswd", {
					"Identity": user.sAMAccountName,
					"NewPassword": "( convertto-securestring -string '" + NewPassword + "' -AsPlainText -Force)"
				},
					function (error, result) {
						var out = {
							user: user.userPrincipalName,
							passwd: true
						}
						if (result.stderr) {
							out.passwd = false;
							out.error = result.stderr;
						}
						cb(error, out);
					});

			} else {
				cb(null, { user: false, passwd: false })
			}
		})
	};
	AdUser.remoteMethod('setpasswd',
		{
			http: { path: '/:Id/setpasswd', verb: 'post' },
			accepts: [
				{ arg: 'Id', type: 'string', http: { source: 'path' }, required: true },
				{ arg: 'NewPassword', type: 'string', required: true}],
			returns: { type: 'object', root: true }
		}
	);






	AdUser.find = function (filter, prop, cb) {
		console.log(cb);
		AD.findUsers(filter, true, function (err, users) {
			if (err) {
				console.log('ERROR: ' + JSON.stringify(err));
				cb(err, null);
			} else {
				if ((!users) || (users.length == 0)) {
					console.log('No users found.');
					cb(null, []);
				}
				else {
					console.log(users);
					cb(null, users);
				}
			}
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


	/* 
	//	---- find by Powershell-RESTAPI ----------
	AdUser.find = function (filter, cb) {
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
	//----------------------------------
	*/

};
