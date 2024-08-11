import json

from flask import current_app as app
from flask import g
from pymemcache import Client


class JsonSerializer:
    def serialize(self, key, value):
        return json.dumps(value).encode('utf-8'), 0

    def deserialize(self, key, value, flag):
        return json.loads(value.decode('utf-8'))


def get_cache():
    if 'cache' not in g:
        g.cache = Client((app.config['MEMCACHE']['HOST'], 11211), serde=JsonSerializer())
    return g.cache
