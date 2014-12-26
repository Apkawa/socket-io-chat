/**
 * Created by apkawa on 12/26/14.
 */
define(["backbone", "./views"],
    function (Backbone, views) {

        var ChatController = Backbone.Router.extend({
            routes: {
                "": "init"
            },

            init: function () {
                console.log("init");
                var chatview = new views.ChatView();
            }

        });


        return {
            ChatController: ChatController
        };
    });