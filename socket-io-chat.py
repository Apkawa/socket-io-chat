import os
import cgi


from flask import Flask, render_template, g
from flask.ext.socketio import (
    SocketIO,
    join_room,
    leave_room,
    emit, request,
    session
)

from flask.ext.cache import Cache

cache = Cache(config={'CACHE_TYPE': 'simple'})

app = Flask(__name__)
cache.init_app(app)
socketio = SocketIO(app)

CHAT_NAMESPACE = '/chat'


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/static/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(os.path.join('static', path))


def get_session_id():
    return request.namespace.socket.sessid


class Chat(object):
    def get_clients(self):
        return cache.get("clients") or dict()

    def get_client(self, _id):
        return self.get_clients()[_id]

    def add_client(self, _id, username=None):
        clients = self.get_clients()
        clients[_id] = username
        cache.set('clients', clients)

    def del_client(self, _id):
        clients = self.get_clients()
        clients.pop(_id, None)
        cache.set('clients', clients)


    @staticmethod
    @socketio.on('connect', namespace=CHAT_NAMESPACE)
    def connect():
        _id = get_session_id()
        username = "Guest_%s" % _id
        print('Client connected: %s' % username)
        emit('client_connected', {'status': 'OK', "id": _id, "username": username})
        emit('client_joined', {'status': 'OK', "id": _id, "username": username}, broadcast=True)
        Chat().add_client(_id, username)


    @staticmethod
    @socketio.on('disconnect', namespace=CHAT_NAMESPACE)
    def disconnect():
        print('Client disconnected')
        emit('client_leaved', {'status': 'OK', "id": get_session_id()}, broadcast=True)
        Chat().del_client(get_session_id())


    @staticmethod
    @socketio.on('message', namespace=CHAT_NAMESPACE)
    def message(msg):
        _id = get_session_id()
        client = Chat().get_client(_id)
        app.logger.debug("message from %s: ", _id, msg)
        emit("message", {"status": "OK", "id": _id, "username": client, "msg": cgi.escape(msg)}, broadcast=True)


    @staticmethod
    @socketio.on('client_list', namespace=CHAT_NAMESPACE)
    def list():
        clients = [{"id": key, "username": value} for key, value in Chat().get_clients().items()]
        emit("client_list", {"status": "OK", "clients": clients})


def socket_io_app_run():
    socketio.run(app, host="0.0.0.0", port=5000)


if __name__ == '__main__':
    socket_io_app_run()
