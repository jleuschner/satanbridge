module.exports = function (AdUser) {
	var PSCommand = require('../../modules/pscommand');
	var ActiveDirectory = require('activedirectory');
	var siteconfig = require('../../siteconfig');
	var AD = new ActiveDirectory(siteconfig.activedirectory);

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
					users.enabled = (users.userAccountControl & 2) != 2;
					//users.passwdAllowed = (users.userAccountControl & 64) != 64;
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
						cb(null, { user: user, isAuthenticated: false });
						return;
					}
					if (auth) {
						cb(err, { user: user, isAuthenticated: true });
					}
					else {
						cb(err, { user: user, isAuthenticated: false });
					}
				})
			} else {
				cb(null, { user: false, isAuthenticated: false })
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
							user: user,
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
				{ arg: 'OldPassword', type: 'string', required: true },
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


	function ldap2ps(user) {
		// LDAP-Felder in Powershell Namenskonventionen
		console.log(user);
		var ret = {};
		ret.Enabled = (user.userAccountControl & 2) != 2;
		ret.DistinguishedName = user.dn;
		ret.Name = user.displayName ? user.displayName : "";
		ret.SamAccountName = user.sAMAccountName ? user.sAMAccountName : "";
		ret.department = user.department ? user.department : "";
		ret.extensionAttribute1 = user.extensionAttribute1 ? user.extensionAttribute1 : "";
		ret.extensionAttribute2 = user.extensionAttribute2 ? user.extensionAttribute2 : "";
		ret.ObjectClass = user.objectClass.indexOf('user') < 0 ? 'contact' : 'user';
		return ret;
	}



	AdUser.find = function (filter, prop, cb) {
		if (filter.indexOf("=") < 1) filter = "name=" + filter;
		AD.findUsers(filter, false, function (err, users) {
			if (err) {
				console.log('ERROR: ' + JSON.stringify(err));
				cb(err, null);
			} else {
				if ((!users) || (users.length == 0)) {
					//console.log('No users found.');
					cb(null, []);
				}
				else {
					var out = [];
					users.forEach(function (obj) {
						out.push(ldap2ps(obj));
					})
					cb(null, out);
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



	AdUser.departments = function (filter, prop, cb) {
		filter = "name=*";
		AD.findUsers(filter, false, function (err, users) {
			if (err) {
				console.log('ERROR: ' + JSON.stringify(err));
				cb(err, null);
			} else {
				if ((!users) || (users.length == 0)) {
					//console.log('No users found.');
					cb(null, []);
				}
				else {
					var out = [];
					users.forEach(function (obj) {
						//if (obj.department == null) console.log("NULL: ", obj.displayName);
						if ((obj.userAccountControl & 2) == 2) return;
						if (out.indexOf(obj.department) < 0) {
							out.push(obj.department);
						}
					})
					cb(null, out);
				}
			}
		});
	};

	AdUser.remoteMethod(
        'departments',
        {
        	http: { path: '/departments', verb: 'get' },
        	accepts: [{ arg: 'filter', type: 'string', required: false },
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
