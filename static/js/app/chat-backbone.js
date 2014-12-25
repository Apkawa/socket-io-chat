define(["jquery", "rsii", "socket.io", "backbone"], function ($, fmt, io, Backbone) {

    var ChatView = Backbone.View.extend({
        el: "#chat-app",
        events: {
            "keydown input": "send_message"
        },

        send_message: function(e) {
            if (e.keyCode == 13) {
                var el = e.currentTarget;
                console.log("send_message", el.value);
                //chat_ns.emit("message", this.value);
                el.value = "";
            }
        }
    });

    var Controller = Backbone.Router.extend({
        routes: {
            "": "init"
        },
        init: function () {
            console.log("init");
            var chatview = new ChatView();
        }

    });

    var controller = new Controller(); // Создаём контроллер
    Backbone.history.start();  // Запускаем HTML5 History push
});