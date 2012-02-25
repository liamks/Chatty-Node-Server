
var app = require('http').createServer();
var io = require('socket.io');
var _ = require('underscore')._;

io = io.listen(app);
io.configure(function(){
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
  io.set("close timeout", 10);
  io.set("log level", 1);
})

var users = {};

io.sockets.on('connection', function (socket) {
  var user;

  socket.emit('users-connected', _.values(users));

  socket.on('new-user', function (data) {
    user = data
    users[user.id] = data
    socket.broadcast.emit('new-user-connected', data);
  });

  socket.on('message', function(msgInfo){
    msgInfo.isFromMe = false;
    socket.broadcast.emit('receieve-message', msgInfo);
  });

  socket.on('disconnect', function(){
    if(user){
      delete users[user.id];
      socket.broadcast.emit('user-disconnected', user);
    };
  })
});
//this line is necessary for heroku
var port = process.env.PORT || 5001;
app.listen(port);