/**
 * Created by apkawa on 12/26/14.
 */
define([
        "underscore",
        "./models",
        "./controllers",
        "./client",
        "./views"
    ],
    function (_,
              models,
              controllers,
              client,
              views
    ) {
        return _.extend(models, controllers, client, views);
    });