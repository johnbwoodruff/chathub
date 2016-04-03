function chatsService($firebaseArray, $firebaseObject, $q) {
	// Generates a "UUID", doesn't quite meet every single requirement, but is really close.
	function uuid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	}

	function getRooms() {
		var roomsRef = new Firebase("https://chathub-app.firebaseio.com/rooms");
		return $firebaseArray(roomsRef);
	}

	function createRoom(room) {
		var deferred = $q.defer();
		room.private = parseInt(room.private);
		// Create new room with random UUID
		var roomRef = new Firebase("https://chathub-app.firebaseio.com/rooms/" + uuid());
		var currRoom = $firebaseObject(roomRef);
		// Set values
		currRoom.name = room.name;
		currRoom.topic = room.topic;
		currRoom.private = room.private;
		currRoom.$save().then(function() {
			deferred.resolve('Room successfully created');
		});
		return deferred.promise;
	}

	function getMessages(roomId) {
		var messagesRef = new Firebase("https://chathub-app.firebaseio.com/messages/" + roomId);
		return $firebaseArray(messagesRef);
	}

	return {
		getRooms: getRooms,
		createRoom: createRoom,
		getMessages: getMessages
	};
}

angular.module('chathub.chats-service')
.service('chatsService', ['$firebaseArray', '$firebaseObject', '$q', chatsService]);
