function chatsDetailController() {
	var ctrl = this;

	ctrl.helloWorld = 'Hello World (Chats Detail)!';
}

angular.module('chathub.chats-detail')
.component('chatsDetail', {
	templateUrl:'modules/chats-detail/chats-detail.tpl.html',
	controller:[chatsDetailController],
	bindings:{}
});
