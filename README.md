# Running in Docker
## Installation
- `docker pull memcached`
- `docker build .`

## Running
- `docker network create digitall`
- `docker run -d --rm --net digitall --name digitall_memcached memcached`
- `docker run -d --rm --net digitall -p <NGINX PORT>:8000 <IMAGE>`


# Running locally without Docker
## Installation
- `sudo apt install memcached`
- `service memcached start`
