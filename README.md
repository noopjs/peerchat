# peerchat

### Example Application for Exploring PeerJS, built with the [MEAN](http://meanjs.org/) Stack


## Before You Begin
Before you begin we recommend you read about the basic building blocks that power this application:
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/), which has a [Getting Started](http://expressjs.com/starter/installing.html) guide, as well as an [ExpressJS Guide](http://expressjs.com/guide/error-handling.html) guide for general express topics. You can also go through this [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js) for more resources.
* AngularJS - Angular's [Official Website](http://angularjs.org/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and the [Egghead Videos](https://egghead.io/).
* PeerJS - See the Getting Started guide at the [Official Website](http://peerjs.com/)
* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.


## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* MinGW - [Download and Install](http://www.mingw.org/download/installer) MinGW if you are on a Windows machine.  Make sure to include the MSYS shell and GIT as part of your install
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process. Make sure you've installed Node.js and npm first, then install grunt globally using npm:

```bash
$ npm install -g grunt-cli
```
* Heroku Toolbelt - You need this to deploy the server to the Heroku cloud. [Download and Install](https://toolbelt.heroku.com/).  Make sure to create an account on [heroku.com](https://www.heroku.com/) using your gmail ID as the login.  

## Clone the Repository

```
$ git clone https://github.com/noopjs/peerchat.git
```

## Install

The first thing you should do is install the Node.js dependencies. The package.json file at the root of the repository contains the list of modules you need to start your application.  To install these dependencies, do:

```
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* Finally, when the install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application

## Start the Development Database Server

In the production environment, the database server runs as a MongoHQ "add on" to the Heroku cloud application. It is both unnecesary and impractical to connect to this db server during development. Create an empty directory somewhere in your filesystem (in your downloads/ or junk/ folder; don't do this under the peerchat/ folder) and run `mongod` to start the MongoDB daemon:

```
$ mkdir /path/to/db_dir
$ "/c/Program Files/MongoDB 2.6 Standard/bin/mongod.exe" --dbpath /path/to/db_dir
```

## Running Your Application
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

Your application should run on the 3001 port so in your browser just go to [http://localhost:3001](http://localhost:3001)

That's it! your application should be running by now........

## Testing Your Application
You can run the full test suite included with MEAN.JS with the test task:

```
$ grunt test
```

This will run both the server-side tests (located in the app/tests/ directory) and the client-side tests (located in the public/modules/*/tests/).

To execute only the server tests, run the test:server task:

```
$ grunt test:server
```

And to run only the client tests, run the test:client task:

```
$ grunt test:client
```

## Deploy to Heroku

If you have have been aded as a collaborator, you should have received a welcome email from Heroku. Install the toolbelt and login:

```
$ heroku login
```
Next, add the heroku remote:

```
$ heroku git:remote git@heroku.com:monkeychat.git
```

To go live, first run the grunt "build" task. This concatenates and minifies your code to "public/dist/application.min.js".  Now commit your code as usual and push to the Heroku remote:

```
$ grunt build
$ git commit -m "Preparing to deploy" -a
$ git push heroku master
```

The heroku remote is only for continuous integration and deployment. **Do not clone and modify.**


## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
