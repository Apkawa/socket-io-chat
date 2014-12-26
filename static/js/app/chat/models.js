/**
 * Created by apkawa on 12/26/14.
 */

define([
        "backbone"
    ],
    function (Backbone) {
        var ClientModel = Backbone.Model.extend({});
        var MessageModel = Backbone.Model.extend({});

        var ClientCollection = Backbone.Collection.extend({
            model: ClientModel
        });

        var MessageCollection = Backbone.Collection.extend({
            model: MessageModel
        });

        var ChatModel = Backbone.Model.extend({
            defaults: {
                clients: new ClientCollection(),
                messages: new MessageCollection()
            },

            addClient: function (id, username) {
                this.get('clients').add(new ClientModel({username: username, id: id}))
            },

            getClientById: function (id) {
                return this.get("clients").find(function (item) {
                    return item.get('id') == id;
                });
            },

            removeClientById: function (id) {
                var client = this.getClientById(id);
                if (client) {
                    this.get('clients').remove(client);
                }
            },

            addMessage: function (sender, message) {
                this.get("messages").add(
                    new MessageModel(
                        {'message': message, sender: sender}
                    ))
            }


        });


        return {
            ChatModel: ChatModel,
            ClientModel: ClientModel
        }

    });
