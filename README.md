# Bozeman Pet Project

## Description
A node/mongo/react web application that populates itself with data from any shelter's [Petango](http://petango.com/) listings and displays them in a responsive, user-friendly interface.

## Features
- User account creation.
- Browse pets by species.
- Subscribe and receive email notifications about new pets.
- Save favorite pets.
  - Get notified of sponsorships and changes to status of their favorite pets (future version).
- Donate money (sponsor) specific pets.
- Mobile friendly, responsive interface

## Srape N' Sync
![scrape n sync 1](https://cloud.githubusercontent.com/assets/15158614/24844650/90a61e0e-1d69-11e7-85a5-75ccb981c164.png)

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
