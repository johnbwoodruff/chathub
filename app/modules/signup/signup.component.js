function signupController($state, $rootScope, $mdToast, Users) {
	var ctrl = this;

	function showToast(message) {
		$mdToast.show(
			$mdToast.simple()
			.textContent(message)
			.position('top right')
			.hideDelay(3000)
		);
	}

	ctrl.createUser = function() {
		var promise = Users.createUser(ctrl.user);
		promise.then(function(message) {
			showToast(message);
			$rootScope.user = ctrl.user;
			$rootScope.noUser = false;
			$state.go('chats');
		}, function(reason) {
			showToast(reason);
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
	controller:['$state', '$rootScope', '$mdToast', 'usersService', signupController],
	bindings:{}
});
