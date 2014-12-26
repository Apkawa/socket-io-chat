/**
 * Created by apkawa on 12/26/14.
 */
define([
        "socket.io"
    ],
    function () {
        var ChatClient = function (options) {
            var self = this;
            self.hostname = 'http://' + document.domain + ':' + location.port;
            self.namespace = "/chat";

            self.events = options.events;

            self.response_events_names = [
                "connect",
                "client_connected",
                "client_list",
                "client_joined",
                "client_leaved",
                "message"
            ];

            self.response_events = {};

            self.connect = function () {
                self.socket = io.connect(self.hostname)
                    .of(self.namespace);
                self.setResponseListeners(self.socket)
            };

            self.send_message = function (message) {
                self.socket.emit("message", message)
            };

            self.get_list = function () {
                self.socket.emit("client_list");
            };


            self.setResponseListeners = function (socket) {

                var _create_callback_function = function (event_name) {
                    return function (data) {
                        console.log("event: " + event_name, data);
                        self.events.trigger(event_name, data)
                    }
                };


                for (var i = 0; i < self.response_events_names.length; i++) {
                    var event_name = self.response_events_names[i];
                    var handler_func = self.response_events[event_name]
                        || _create_callback_function(event_name);

                    socket.on(event_name, handler_func)

                }

            }
        };
        return {
            ChatClient: ChatClient
        };
    });