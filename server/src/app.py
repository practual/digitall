from random import randint
from uuid import uuid4

from flask import Flask, render_template

app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html")


@app.post('/api/game')
def create_game():
    return {
        "game_id": uuid4(),
        "target": randint(0, 999),
        "options": [randint(0, 99) for _ in range(5)],
    }
