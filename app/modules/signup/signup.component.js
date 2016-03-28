const storage = require('electron-json-storage');

function signupController($state, $rootScope, $firebaseObject, $mdToast) {
	var ctrl = this;

	function userAlreadyExistsToast() {
		$mdToast.show(
			$mdToast.simple()
			.textContent('Username already taken')
			.position('top right')
			.hideDelay(3000)
		);
	}

	ctrl.createUser = function() {
		var userRef = new Firebase("https://chathub-app.firebaseio.com/users/" + ctrl.user.username);
		$rootScope.currUser = $firebaseObject(userRef);
		$rootScope.currUser.$loaded().then(function() {
			// Check if current user exists.
			console.log($rootScope.currUser);
			if($rootScope.currUser.name) {
				// Username Already Exists
				userAlreadyExistsToast();
				return;
			}
			// User doesn't exist, go ahead and create.
			$rootScope.currUser.name = ctrl.user.name;
			$rootScope.currUser.$save().then(function() {
				// Add to local storage
				storage.set('user', ctrl.user, function(error) {
					if (error) throw error;

					$rootScope.user = ctrl.user;
					$rootScope.noUser = false;
					$state.go('chats');
				});
			});
		}).catch(function(err) {
			console.log(err);
		});
	};

	function setup() {
		ctrl.user = {
			username: '',
			name: ''
		};
	}

	setup();
}

angular.module('chathub.signup')
.component('signup', {
	templateUrl:'modules/signup/signup.tpl.html',
	controller:['$state', '$rootScope', '$firebaseObject', '$mdToast', signupController],
	bindings:{}
});
