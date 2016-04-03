function createChatController($scope, $mdDialog, chatsService) {
	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.createRoom = function() {
		// Create Room
		var promise = chatsService.createRoom($scope.room);
		promise.then(function(message) {
			$mdDialog.hide(message);
		}, function(reason) {
			console.log(reason);
		});
	};

	function setup() {
		$scope.room = {
			name: '',
			topic: '',
			private: 0
		};
	}

	setup();
}

function chatsController($firebaseArray, $mdDialog, $mdToast, $state) {
	var ctrl = this;

	function showToast(message) {
		$mdToast.show(
			$mdToast.simple()
			.textContent(message)
			.position('top right')
			.hideDelay(3000)
		);
	}

	ctrl.showCreateChatDialog = function() {
		$mdDialog.show({
			controller: createChatController,
			templateUrl: 'modules/chats/create-chat-popup.tpl.html',
			parent: angular.element(document.body),
			clickOutsideToClose:true
		})
		.then(function(message) {
			showToast(message);
		}, function() {
			console.log('DIALOG CANCELLED');
		});
	};

	ctrl.openRoom = function(id) {
		$state.go('chats.detail',{id:id});
	};

	function setup() {
		ctrl.helloWorld = 'Hello World!';
	}

	setup();
}

angular.module('chathub.chats')
.component('chats', {
	templateUrl:'modules/chats/chats.tpl.html',
	controller:['$firebaseArray', '$mdDialog', '$mdToast', '$state', chatsController],
	bindings:{}
});
