const storage = require('electron-json-storage');

function signupController($state, $rootScope) {
	var ctrl = this;

	function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
	}

	ctrl.createUser = function() {
		// TODO: Add user to electron storage.
		if(!ctrl.signupForm.$valid) {
			console.log('NOT VALID YOU IDIOT');
		}
		else {
			ctrl.user.id = guid();
			storage.set('user', ctrl.user, function(error) {
				if (error) throw error;

				$rootScope.user = ctrl.user;
				$rootScope.noUser = false;
				$state.go('chats');
			});
		}
	};

	function setup() {
		ctrl.helloWorld = 'Hello World!';
		ctrl.user = {
			id: '',
			firstName: '',
			lastName: ''
		};
	}

	setup();
}

angular.module('chathub.signup')
.component('signup', {
	templateUrl:'modules/signup/signup.tpl.html',
	controller:['$state', '$rootScope', signupController],
	bindings:{}
});
