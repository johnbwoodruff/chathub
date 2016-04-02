const storage = require('electron-json-storage');

function usersService($firebaseArray, $firebaseObject, $rootScope, $q) {

	function getUsers() {
		var usersRef = new Firebase("https://chathub-app.firebaseio.com/users");
		return $firebaseArray(usersRef);
	}

	function createUser(user) {
		var deferred = $q.defer();
		console.log(user);
		var userRef = new Firebase("https://chathub-app.firebaseio.com/users/" + user.username);
		var currUser = $firebaseObject(userRef);
		currUser.$loaded().then(function() {
			// Check if current user exists.
			console.log(currUser);
			if(currUser.name) {
				// Username Already Exists
				deferred.reject('Username already taken');
			}
			else {
				// User doesn't exist, go ahead and create.
				currUser.name = user.name;
				currUser.$save().then(function() {
					// Add to local storage
					storage.set('user', user, function(error) {
						if (error) {
							deferred.reject('Error saving user locally');
							throw error;
						}

						deferred.resolve('Successfully created user');
					});
				});
			}
		}).catch(function(err) {
			console.log(err);
			deferred.reject('Error loading from Firebase');
		});
		return deferred.promise;
	}

	return {
		getUsers: getUsers,
		createUser: createUser
	};
}

angular.module('chathub.users-service')
.service('usersService', ['$firebaseArray', '$firebaseObject', '$rootScope', '$q', usersService]);
