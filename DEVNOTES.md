I implemented a new chat.js that is kinda middle stack to communicate with stuff, David should 
look at that and tailor the frontend a little to that. The code is not set in stone, just move
things around if you think it's more neat and fluid in a different way.
I considered doing two .js files in the public folder, one for the main page and another for the chat
page but this example i found uses 1 .js file to control both pages. don't even need two html files 
either:

https://github.com/socketio/socket.io/tree/master/examples/chat

extremely good example. our code will be very similar but i need to figure out how to hash the password and stuff once the front and middle stacks are implemented
