function chatsDetailController(Chats, $stateParams, $rootScope) {
	var ctrl = this;

	ctrl.addMessage = function(ev) {
		// Check if enter is the key hit.
		if(ev.which === 13) {
			var chat = {
				message:ctrl.chatBox,
				author:$rootScope.user.username,
				timestamp:Firebase.ServerValue.TIMESTAMP
			};
			ctrl.messages.$add(chat).then(function() {
				ctrl.chatBox = '';
			});
		}
	};

	function setup() {
		ctrl.roomId = $stateParams.id;
		ctrl.messages = Chats.getMessages(ctrl.roomId);
	}

	setup();
}

angular.module('chathub.chats-detail')
.component('chatsDetail', {
	templateUrl:'modules/chats-detail/chats-detail.tpl.html',
	controller:['chatsService', '$stateParams', '$rootScope', chatsDetailController],
	bindings:{}
});
