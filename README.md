Forked from dawidaksamski/node-red-contrib-socketio-agent

Updated to allow the ability to send and receive to/from any SocketIO event
There is also now only one connection made to the SocketIO server so that event updates don't get retransmitted back to Node-RED assuming the server uses `socket.broadcast.emit` to push events back out to all connected clients.

When connected, the Socket.IO Client node displays the last 10 characters of the id associated with the connection to the SocketIO server

[input]
msg.eventName contains the name of the event to emit to the SocketIO server 
msg.payload contains the data to be sent along with the event

[output]
msg.eventName contains the name of the event emitted by the SocketIO server 
msg.payload contains the data that was sent along with the event

## How to use