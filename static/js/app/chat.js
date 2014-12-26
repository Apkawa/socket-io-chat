

define(["zepto", "rsii", "socket.io"], function($, fmt, io){
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    var chat_ns = socket.of("/chat");

    var visitor_template = fmt(
        '<tr data-user-id="#{id}"> <td>#{username}</td> </tr>'
    );

    var message_template = fmt(
        '<p data-user-id="#{id}"> <b>#{username}</b>: #{msg}</p>'
    );
    chat_ns.on('connect', function () {
        }
    );

    chat_ns.on('client_connected', function (msg) {
            console.log("connected", msg);
            chat_ns.emit("client_list");
        }
    );

    chat_ns.on('client_list', function (msg) {
        console.log("list", msg);

        $("#visitors tbody > *").remove();

        var clients = msg['clients'];
        for (var i in clients) {
            if (clients.hasOwnProperty(i)) {
                $("#visitors tbody").append(visitor_template({"username": clients[i], "id": i}))
            }
        }
    });
    chat_ns.on('client_joined', function (msg) {
            console.log("joined", msg);
            $("#visitors tbody").append(visitor_template(msg))
        }
    );
    chat_ns.on('client_leaved', function (msg) {
            console.log("leaved", msg);
            $("tr[data-user-id='" + msg.id + "']").remove()
        }
    );

    chat_ns.on("message", function (msg) {
        console.log("recive message", msg);
        $("#chat").append(message_template(msg))

    });

    $(function () {
        $("input").keypress(function (e) {
            if (e.keyCode == 13) {
                console.log("send_message", this.value);
                chat_ns.emit("message", this.value);
                this.value = "";
            }
        });

    });

});