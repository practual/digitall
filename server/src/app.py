import os
from random import randint
from uuid import uuid4

import yaml
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

from cache import get_cache

app = Flask(__name__)
app.config.from_file(
    os.path.join('settings', os.environ.get('DIGITALL_DEPLOYMENT_MODE', 'local') + '.yml'),
    yaml.safe_load
)
socketio = SocketIO(app, path="/api/socket.io")


@app.get("/")
def index():
    return render_template("index.html")


@app.post('/api/game')
def create_game():
    game_id = str(uuid4())
    game = {
        "game_id": game_id,
        "target": randint(0, 999),
        "options": [randint(0, 99) for _ in range(5)],
    }
    cache = get_cache()
    cache.set(game_id, game)
    return {
        "game_id": game_id,
    }, 201


@socketio.on("get_game")
def get_game(game_id):
    cache = get_cache()
    game = cache.get(game_id)
    emit("game_state", game, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0')
