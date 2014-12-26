requirejs.config({
    baseUrl: '/static/js/libs',
    paths: {
        app: '../app',
        zepto: "zepto.min",
        backbone: "backbone",
        rssi: 'rssi',
        "socket.io": "socket.io-0.9.16",
        "underscore": "underscore",
        urlArgs: "r=2"
    },
    map: {
        "*": {jquery: "zepto"}
    },
    shim: {
        backbone: ["zepto", "underscore"],
        zepto: {
            exports: "$"
        },

        underscore: {
            exports: "_"
        }
    }
});


