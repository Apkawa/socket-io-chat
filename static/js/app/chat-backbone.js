define([
        "backbone",
        "underscore",
        "./chat/main"
    ],
    function (Backbone, _,
              chat) {

        var Main = function () {
            self = this;

            self.appEventsBus = _.extend({}, Backbone.Events);
            self.viewEventsBus = _.extend({}, Backbone.Events);

            self.init = function () {
                self.chat_client = new chat.ChatClient({events: self.appEventsBus});
                self.chat_client.connect();

                self.chat_model = new chat.ChatModel();
                self.chat_view = new chat.ChatView({model: self.chat_model, events_bus: self.viewEventsBus});
                self.chat_view.render()
            };

            self.viewEventsBus.on("message", function (message) {
                self.chat_client.send_message(message);
            });

            self.appEventsBus.on("message", function (data) {
                var client = self.chat_model.getClientById(data.id);
                self.chat_model.addMessage(client, data.msg)
            });

            self.appEventsBus.on("connect", function (data) {
                self.chat_client.get_list();
            });

            self.appEventsBus.on("client_list", function (data) {
                var client = _.map(data.clients, function (item) {
                    return new chat.ClientModel(item);
                });
                self.chat_model.get("clients").reset(client);
            });

            self.appEventsBus.on("client_joined", function (data) {
                self.chat_model.addClient(data.id, data.username)
            });

            self.appEventsBus.on("client_leaved", function (data) {
                self.chat_model.removeClientById(data.id)
            });

        };

        var main = new Main();
        main.init();
    });