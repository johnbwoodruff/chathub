import os from 'os';
import env from './env';
const storage = require('electron-json-storage');

angular.module('chathub', [
	'ngMaterial',
	'ui.router',
	'firebase',
	'chathub.signup',
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
	});
	// .state('chats.detail', {
	// 	url: '/detail/:id',
	// 	template: '<chats-detail></chats-detail>'
	// });
	$urlRouterProvider.otherwise('/chats');

	$mdThemingProvider.theme('default')
		.primaryPalette('blue')
		.accentPalette('deep-orange');
}])
.run(['$rootScope', '$state', '$firebaseArray', function($rootScope, $state, $firebaseArray) {
	$rootScope.appEnv = env.name;
	$rootScope.osPlatform = os.platform();
	$rootScope.noUser = true;
	$rootScope.user = {};

	// Get all users.
	var ref = new Firebase("https://chathub-app.firebaseio.com/users");
	$rootScope.allUsers = $firebaseArray(ref);
	$rootScope.allUsers.$loaded().then(function() {
		console.log($rootScope.allUsers);
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

				console.log(data);
				$rootScope.user = data;
				$rootScope.noUser = false;
			});
		}
		else {
			$rootScope.noUser = true;
			$state.go('signup');
		}
	});
}]);
