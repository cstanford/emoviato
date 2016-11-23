# Emoviato
A web app that maps the range of twitter user's emotions associated with the top 5 twitter trends through the very scientific method of gathering emojis.


### Dependancies:
 * [node.js] - evented I/O for the backend
 * [Bower] - a package manager for the web
 * [Gulp] - the streaming build system
 * [Sass] - syntactically awesome style sheets

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

Build:
```sh
$ cd gulp
$ gulp fullbuildprod
```

Start the server:
```sh
$ cd server
$ node server.js
```

### Get lit
- Navigate to localhost:11000
- Sample data is ready to go!

### Fetching Data

To begin fetching your own data you will need two more dependancies:
 * [Python3]
 * [Tweepy] - a python twitter api

Run the python scripts:
```sh
$ cd python
$ python3 Emoviato.py
```
Emoviato will begin fetching data from twitter (this normally takes about 30 seconds give or take.)
- ##### Do not run the script more than once per 15 minutes!
- the twitter api limits the number of requests we can make.
- todo: take out our auth key...explain how to get one...

Once the python script is finished, navigate back to localhost:11000 and check out the data!

##### Made hackathon style by:
- Connor Stanford
- Alex Fontenot
- Brad Landreneau
- Hung Le



[Bower]: <https://bower.io/>
[node.js]: <http://nodejs.org>
[Gulp]: <http://gulpjs.com>
[Sass]: <http://sass-lang.com/>
[Python3]: <https://www.python.org/download/releases/3.0/>
[Tweepy]: <https://github.com/tweepy/tweepy>


