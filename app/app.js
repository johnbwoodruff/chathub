import os from 'os';
import env from './env';
const storage = require('electron-json-storage');

angular.module('chathub', [
	'ngMaterial',
	'ui.router',
	'firebase',
	'chathub.signup',
	'chathub.users-service',
	'chathub.chats-service',
	'chathub.chats',
	'chathub.chats-detail'
])
.config(['$mdThemingProvider', '$urlRouterProvider', '$stateProvider', function($mdThemingProvider, $urlRouterProvider, $stateProvider) {
	// Now set up the states
	$stateProvider
	.state('signup', {
		url: '/signup',
		template: '<signup flex="" layout="column"></signup>'
	})
	.state('chats', {
		url: '/chats',
		template: '<chats flex="" layout="column"></chats>'
	})
	.state('chats.detail', {
		url: '/detail/:id',
		template: '<chats-detail flex="" layout="column"></chats-detail>'
	});
	$urlRouterProvider.otherwise('/chats');

	$mdThemingProvider.theme('default')
		.primaryPalette('blue')
		.accentPalette('deep-orange');
}])
.run(['$rootScope', '$state', '$firebaseArray', 'chatsService', 'usersService', function($rootScope, $state, $firebaseArray, Chats, Users) {
	$rootScope.appEnv = env.name;
	$rootScope.osPlatform = os.platform();
	$rootScope.noUser = true;
	$rootScope.user = {};

	var originatorEv;
	$rootScope.openMenu = function($mdOpenMenu, ev) {
		originatorEv = ev;
		$mdOpenMenu(ev);
	};

	$rootScope.logout = function() {
		storage.remove('user', function(error) {
			if(error) throw error;

			$rootScope.user = {};
			$rootScope.currUser = {};
			$rootScope.noUser = true;
			$state.go('signup');
		});
	};

	$rootScope.rooms = Chats.getRooms();
	$rootScope.rooms.$loaded().then(function() {
		$rootScope.$broadcast('rooms-loaded');
	}).catch(function(err) {
		console.log(err);
	});

	// Check for user. If no user, go to signup page.
	storage.has('user', function(error, hasKey) {
		if (error) {
			throw error;
		}
		if (hasKey) {
			storage.get('user', function(error, data) {
				if (error) {
					throw error;
				}

				$rootScope.user = data;
				$rootScope.noUser = false;

				// Get all users.
				$rootScope.allUsers = Users.getUsers();
				$rootScope.allUsers.$loaded().then(function() {
					// Potentially do something here with the users.
					if(!$rootScope.allUsers.$getRecord($rootScope.user.username)) {
						$rootScope.logout();
					}
				}).catch(function(err) {
					console.log(err);
				});
			});
		}
		else {
			$rootScope.noUser = true;
			$state.go('signup');
		}
	});
}]);
