module.exports = function(RED) {
    'use strict';

    function connect(uri, options) {
        var io = require('socket.io-client')
        var socket = io(uri, options);
        var patch = require('socketio-wildcard')(io.Manager);
        patch(socket);
        return socket
    }

    /* socket config */
    function SocketIOConfig(config) {
        RED.nodes.createNode(this, config);
        this.uri = config.uri;
        this.options = config.options;
    }
    RED.nodes.registerType('socketio-config', SocketIOConfig);
   
    /* sckt listener*/
    function SocketIOClient(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
        this.eventName = config.eventname;
        
        var server = RED.nodes.getNode(config.server);
        this.socket = connect(server.uri, JSON.parse(server.options || '{}'));

        var node = this;
        this.socket.on('connect', () => {
            node.status({ fill: 'green', shape: 'dot', text: 'connected ' + this.socket.id.slice(-10) });
        });

        this.socket.on('disconnect', function () {
            node.status({ fill: 'red', shape: 'ring', text: 'disconnected' });
        });

        this.socket.on('connect_error', function(err) {
            if (err) {
                node.status({ fill: 'red', shape: 'ring', text: 'error' });
                node.send({ payload: err });
            }
        });

        this.socket.on("*", function (event) {
            node.send({ eventName: event.data[0], payload: event.data[1] });
        })

        node.on('input', function (msg) {
            const data = msg.payload;
            if (data) {
                node.socket.emit(msg.eventName, data);
            }
        });

        node.on('close', function (done) {
            node.socket.disconnect();
            node.status({});
            done();
        });
    }
    RED.nodes.registerType('socketio-client', SocketIOClient);
};
