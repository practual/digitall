FROM node:20

WORKDIR /home/node/app

COPY client client

COPY package.json .

COPY package-lock.json .

COPY webpack.config.js .

RUN npm install

RUN npx webpack

FROM python:3.12

WORKDIR /usr/src/app

COPY server/src .

COPY requirements.txt .

COPY --from=0 /home/node/app/client/build static

RUN pip install --no-cache-dir -r requirements.txt

CMD [ "python", "./app.py" ]

