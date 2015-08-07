module.exports = function (app) {
	var User = app.models.user;
	var Role = app.models.Role;
	var RoleMapping = app.models.RoleMapping;
	/*
	var Team = app.models.Team;
	*/

	var defaultUsers = [
        {
        	username: "admin",
        	password: "admin",
        	email: "admin@admin.local",
        	firstName: "Admin",
        	lastName: "Administrator"
        }
    ];

	defaultUsers.forEach(function (user) {
		User.findOrCreate({ where: { username: user.username} }, user,
        function (err, createdUser, created) {
        	if (err) {
        		console.error('error creating default Users', err);
        	}
        	(created) ? console.log('created user', createdUser.username)
                        : console.log('found user', createdUser.username);
        });
	});

	Role.findOrCreate({ where: { name: "SuperAdmin"} }, { name: "SuperAdmin" },
			function (err, createdRole, created) {
				if (err) {
					console.error('error running findOrCreate(' + 'SuperAdmin' + ')', err);
				}
				(created) ? console.log('created role', createdRole.name)
									: console.log('found role', createdRole.name);
				/*
				createdRole.principals.create({
					principalType: RoleMapping.USER,
					principalId: 1
				}, function (err, principal) {
					if (err) throw err;
					console.log('Created principal:', principal);
				});
				*/
			});

	RoleMapping.findOrCreate({ where: { 
					principalType: RoleMapping.USER,
					principalId: 1,
					roleId: 1
				} }, {
					principalType: RoleMapping.USER,
					principalId: 1,
					roleId: 1
				},
			function (err, createdMapping, created) {
				if (err) {
					console.error('error running Mapping', err);
				}
				(created) ? console.log('created Mapping', createdMapping)
									: console.log('found Mapping', createdMapping);
			});

};