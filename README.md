# Emoviato
A web app that maps the range of twitter user's emotions associated with the top 5 twitter trends through the very scientific method of gathering emojis.


### Dependancies:
 * [node.js] - evented I/O for the backend
 * [Bower] - a package manager for the web
 * [Gulp] - the streaming build system
 * [Sass] - syntactically awesome style sheets
 * [MongoDB] - you know what it is. 

### Installation
Install the dependencies and devDependencies
```sh
$ cd server
$ npm install
```
```sh
$ cd bower
$ bower install
```
```sh
$ cd gulp
$ npm install
```

### Build:
Development:
```sh
$ cd gulp
$ gulp fullbuild
```

Watch frontend javascript and sass files (will not update server code - run gulp fullbuild for server changes):
```sh
$ cd gulp
$ gulp watch
```

Production:
```sh
$ cd gulp
$ gulp fullbuildprod
```

Start the server:
```sh
$ cd server
$ node server.js
```

### Fetching Data

To begin fetching you will need a few more things:
 * [Python3]
 * [Tweepy] - a python twitter api
 * [Pymongo] - a python mongodb driver
> Note: emoviatodb is set to run on port 10100 - it is suggested that you edit your mongod.conf file accordingly. 

Navigate to emoviato/python/common/constants.py and update the authentication constants.

Start mongod as a service and then run Emoviato.py:
```sh
$ cd python
$ python3 Emoviato.py
```
Emoviato will begin fetching data from twitter (this normally takes about 30 seconds give or take.)
- ##### Do not run the script as is more than once per 15 minutes!
- the twitter api limits the number of requests we can make.

Once the python script is finished, navigate back to localhost:11000 and check out the data!

[Bower]: <https://bower.io/>
[node.js]: <http://nodejs.org>
[Gulp]: <http://gulpjs.com>
[Sass]: <http://sass-lang.com/>
[Python3]: <https://www.python.org/download/releases/3.0/>
[Tweepy]: <https://github.com/tweepy/tweepy>
[Pymongo]: <https://api.mongodb.com/python/current/installation.html>
[MongoDB]: <https://www.mongodb.com/download-center?filter=enterprise?jmp=nav#enterprise>