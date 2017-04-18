# Tree Chunks

## Description
It's a tree of chunks

## Features
Trees n' chunks

## Local Setup

### Install node
https://nodejs.org/en/download/
At least version 6.9.4

### Install Mongo
~~~
$ brew install mongodb
~~~

### Install project dependencies
~~~
$ npm install
~~~

### Run
~~~
$ mongod
$ npm start
~~~

### Configure
Change the following values to get this up and running for any shelter using Petango:
- Change the `url` variable in `srcServer.js` to point to your shelter's Petango page.
- Set a `SECRET` environment variable as an encryption key
- Change the mailgun settings in `mailSend.js`

### View It!
http://localhost:3000

### Run Tests
~~~
$ npm test
~~~

## Contributors
Jennifer Phelps,
Adam Hoberecht,
Tim Walsh
