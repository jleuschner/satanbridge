module.exports.activedirectory= {
		url: 'ldap://kl.kdo.int',
		baseDN: 'DC=kl,DC=kdo,DC=int',		// Suchbasis
		username: 'srv_phone@kl.kdo.int',	// Standardbenutzer für Read-Zugriffe
		password: 'teLeF0n3',  
		attributes: {
			user: [
				'dn', 'userPrincipalName','sAMAccountName', 'objectClass',
				'displayName', 'givenName', 'sn',
				'department','title','mail', 'telephoneNumber', 'facsimileTelephoneNumber',
				'userAccountControl', 'pwdLastSet',
				'extensionAttribute1', 'extensionAttribute2', 'extensionAttribute6'
				]
		}
}

module.exports.test = {
	test1: "123"
}
