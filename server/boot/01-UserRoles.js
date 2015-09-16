var log = require('debug')('boot:01-UserRoles');
// Enable log: 'set DEBUG=boot:01-UserRoles' or 'set DEBUG=boot:*'

module.exports = function (app) {
	var User = app.models.user;
	var Role = app.models.Role;
	var RoleMapping = app.models.RoleMapping;

	var UserGroup = app.models.UserGroup;

	UserGroup.findOrCreate(
		{ where: { name: "Gruppe1"} },
		{ name: "Gruppe1" }
	);


	log("Default Users and Roles");

	var roles = [
		{ name: 'SuperAdmin',
			users: [{
				username: "admin",
				password: "admin",
				email: "admin@admin.local",
				firstName: "Admin",
				lastName: "Administrator"
			}]
		}, {
			name: 'UserAdmin',
			users: [{
				username: "admin"
			}]
		}
	];

	roles.forEach(function (role) {
		Role.findOrCreate(
			{ where: { name: role.name} },
			{ name: role.name },
			function (err, createdRole, created) {
				if (err) {
					console.error('error running findOrCreate(' + role.name + ')', err);
				}
				(created) ? log('created Role ', createdRole.name)
									: log('found Role ', createdRole.name);
				role.users.forEach(function (roleUser) {
					User.findOrCreate(
						{ where: { username: roleUser.username} },
						roleUser,
						function (err, createdUser, created) {
							if (err) {
								console.error('error creating default Users', err);
							}
							(created) ? log('created user', createdUser.username)
												: log('found user', createdUser.username);

							RoleMapping.findOrCreate(
								{ where: { principalType: RoleMapping.USER, principalId: createdUser.id, roleId: createdRole.id} },
								{ principalType: RoleMapping.USER, principalId: createdUser.id, roleId: createdRole.id },
								function (err, createdMapping, created) {
									if (err) {
										console.error('error running Mapping', err);
									}
									(created) ? log('created Mapping', createdMapping)
														: log('found Mapping', createdMapping);
								});
						});
				});
			});
	});

};