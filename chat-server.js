//this line is necessary for heroku
var port = process.env.PORT || 5001;

var app = express.createServer();
var io = require('socket.io').listen(app);
app.listen(port);

var _ = require('underscore')._;
var users = {};


io.set("transports", ["xhr-polling", "flashsocket", "json-polling"]); 
io.set("polling duration", 10); 


io.sockets.on('connection', function (socket) {
  var user;

  socket.emit('users-connected', _.values(users));

  socket.on('new-user', function (data) {
    user = data
    users[user.uuid] = data
    socket.broadcast.emit('new-user-connected', data);
  });

  socket.on('message', function(msgInfo){
    msgInfo.isFromMe = false;
    socket.broadcast.emit('receieve-message', msgInfo);
  });

  socket.on('disconnect', function(){
    if(user){
      delete users[user.uuid];
      socket.broadcast.emit('user-disconnected', user);
    };
  })
});