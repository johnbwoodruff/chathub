function chatsController($firebaseArray) {
	var ctrl = this;

	function setup() {
		ctrl.helloWorld = 'Hello World!';

		var ref = new Firebase("https://chathub-app.firebaseio.com");
		// download the data into a local object
		ctrl.data = $firebaseArray(ref);
	}

	setup();
}

angular.module('chathub.chats')
.component('chats', {
	templateUrl:'modules/chats/chats.tpl.html',
	controller:['$firebaseArray', chatsController],
	bindings:{}
});
