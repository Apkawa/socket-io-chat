requirejs.config({
    baseUrl: '/static/js/libs',
    paths: {
        app: '../app',
        "jquery-conflict": 'jquery-1.11.2.min',
        "jquery": "../jquery-wrap",
        backbone: "backbone",
        rsii: 'rssi',
        "socket.io": "socket.io-0.9.16",
        "underscore": "underscore"
    },
    shim: {
        backbone: ["jquery", "underscore"]
    },
    urlArgs: "r=2"
});


