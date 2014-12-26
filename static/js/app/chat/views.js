/**
 * Created by apkawa on 12/26/14.
 */
define([
        "backbone",
        "rssi"
    ],
    function (Backbone, fmt) {
        var ChatView = Backbone.View.extend({


            el: "#chat-app",
            events: {
                "keydown input": "send_message"
            },

            visitor_template: fmt(
                '<tr data-user-id="#{id}"> <td>#{username}</td> </tr>'
            ),

            message_template: fmt(
                '<p data-user-id="#{id}"> <b>#{username}</b>: #{message}</p>'
            ),

            initialize: function (options) {
                console.log(options);

                this.events_bus = options.events_bus;

                var clients = this.model.get("clients");
                var messages = this.model.get("messages");

                this.listenTo(clients, "add", this.renderClient, this);
                this.listenTo(clients, "remove", this.renderClients, this);
                this.listenTo(clients, "reset", this.renderClients, this);

                this.listenTo(messages, "add", this.renderMessage, this);
                this.listenTo(messages, "reset", this.renderMessages, this);
            },

            renderClient: function (model) {
                console.log(model.toJSON());
                this.$("#visitors tbody").append(this.visitor_template(model.toJSON()));

                this.$("#client-count").html(this.model.get("clients").length);
            },
            renderClients: function () {
                this.$("#visitors tbody").empty();
                this.model.get("clients").each(
                    function (client) {
                        this.renderClient(client);
                    }, this);

            },
            renderMessage: function (model) {
                var _json = model.toJSON();
                _json['username'] = _json.sender.get("username");
                this.$("#chat").append(this.message_template(_json));

                this.$("#message-count").html(this.model.get("messages").length)

            },
            renderMessages: function () {
                this.$("#chat").empty();
                this.model.get("messages").each(
                    function (message) {
                        this.renderMessage(message)
                    }, this);

            },


            send_message: function (e) {
                if (e.keyCode == 13) {
                    var el = e.currentTarget;
                    console.log("send_message", el.value);
                    this.events_bus.trigger("message", el.value);
                    el.value = "";

                    return false;
                }
            }
        });
        return {
            ChatView: ChatView
        };
    });