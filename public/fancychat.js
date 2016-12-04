$(function() {
	var TYPING_TIMER_LENGTH = 400; //in ms

	var $window = $(window);
	var $usernameInput = $('.usernameInput');
	var $messages = $('.messages');
	var $inputMessage = $('.inputMessage');

	var $loginPage = $('.login.page');
	var $chatPage = $('.chat.page');

	var username;
	var lastTypingTime;
	var connected = false;
	var typing = false;
	var $currentInput = $usernameInput.focus();

	var socket = io();

	function setUsername() {
		username = cleanInput($usernameInput.val().trim());
		if (username) {
			$loginPage.fadeOut();
			$chatPage.show();
			$loginPage.off('click');
			$currentInput = $inputMessage.focus();
	
			socket.emit('add user', username);
		}
	}

	//log how many users there are on server side
	function addUserMessage(data) {
		var message = '';
		if (data.numUsers === 1) {
			message += "there is 1 user";
		} else {
			message += "there are " + data.numUsers + " users";
		}
		log(message);
	}

	function sendMessage() {
		var message = $inputMessage.val();
		message = cleanInput(message);

		if (message && connected) {
			$inputMessage.val('');
			addChatMessage({
				username: username,
				message: message
			});
			socket.emit('new message', message);
		}
	}

	//implement this to save chat history
	function log (message, options) {

	}

	function addChatMessage(data, options) {
		var $typingMessages = getTypingMessages(data);
		options = options || {};
		if ($typing Messages.length !== 0) {
			options.fade = false;
			$typingMessages.remove();
		}

		var $usernameDiv = $('<span class="username"/>')
			.text(data.username)
			.css('color', getUsernameColor(data.username));
		var $messageBodyDiv = $('<span class="messageBody">')
			.text(data.message);

		var typingClass = data.typing ? 'typing' : '';
		var $messageDiv = $('<li class="message"/>')
			.data('username', data.username)
			.addClass(typingClass)
			.append($usernameDiv, $messageBodyDiv);

		addMessageElement($messageDiv, options);
	}

	//shows user is typing
	function addChatTyping(data) {
		data.typing = true;
		data.message = 'is typing';
		addChatMessage(data);
	}

	//removes the show user is typing
	function removeChatTyping(data) {
		getTypingMessages(data).fadeOut(function() {
			$(this).remove();
		});
	}

	function cleanInput(input) {
		return $('<div/>').text(input).text();
	}

	function updateTyping() {
		if (connected) {
			if (!typing) {
				typing = true;
				socket.emit('typing');
			}
			//shows how long the user has not typed anything
			lastTypingTime = (new Date()).getTime();

			setTimeout(function () {
				var typingTimer = (newDate()).getTime();
				var timeDiff = typingTimer - lastTypingTime;
				if (timeDiff >= TUPING_TIMER_LENGTH && typing) {
					socket.emite('stop typing');
					typing = false;
				}
			}, TYPING_TIMER_LENGTH);
		}
	}

	function getTypingMessages(data) {
		return $('.typing.message').filter(function(i) {
				return $(this).data('username') === data.username;
				});
	}

	//implement to give a user a specific colour
	function getUsernameColor(username) {

	}

	$window.keydown(function(event) {
		if (!(event.ctrlKey || event.metaKey || event.altKey)) {
			$currentInput.focus();
		}

		//handles enter key
		if (event.which === 13) {
			if (username) { 
				sendMessage();
				socket.emit('stop typing');
				typing = false;
			} else {
				setUsername();
			}
		}
	});

	$loginPage.click(function() {
		$currentInput.focus();
	});

	$inputMessage.click(function() {
		$inputMessage.focus();
	});

	//sends the message typed
	socket.on('new message', function(data) {
		addChatMessage(data);
	});

	socket.on('user joined', function(data) {
		log(data.username + 'joined');
		addUserMessage(data);
	});

	socket.on('user left', function(data) {
		log(data.username + ' left');
		addUserMessage(data);
		removeChatTyping(data);
	});

	socket.on('typing', function(data) {
		addChatTyping(data);
	});

	socket.on('stop typing', function(data) {
		removeChatTyping(data);
	});



}
