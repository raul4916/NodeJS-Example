FROM node

RUN apt-get update

ADD . /var/sample/sampleProject
WORKDIR /var/sample/sampleProject

RUN npm install --production

EXPOSE 9000

ENTRYPOINT npm start
