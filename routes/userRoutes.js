import React from 'react';
import webpack from 'webpack';
import hash from 'password-hash';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import configAuth from '../tools/configAuth';
import express from 'express';

let userRoutes = express.Router();
let app = express();

userRoutes.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.set('superSecret', configAuth.secret);

userRoutes.post('/newUser', function(req, res) {
  let user = new User();
  user.name = req.body.name;
  user.password = hash.generate(req.body.password);
  user.email = req.body.email;
  user.subscribed = req.body.subscribed;

  user.save(function(err, user){
    if(err){
      res.send(err);
    } else {
      res.json(user);
    }
  });
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
userRoutes.post('/authenticate', function(req, res) {
  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (!hash.verify(req.body.password, user.password)) {
        res.json({
          message: 'Authentication failed. Wrong password.'
        });

      } else {
        // if user is found and password is right
        // create a token
        let token = jwt.sign(user, app.get('superSecret'), {
          // expiresIn: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          token: token
        });
      }

    }

  });
});
//---------Start middleware--------------------

// route middleware to verify a token
userRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  let token = req.headers.authorization.replace("Bearer", "").trim();
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        // req.decoded = decoded;
        req.currentUser = decoded._doc;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});

//---------End middleware--------------------

userRoutes.post('/pets', function(req, res) {
  let id = req.body.id;
  User.update({ _id: req.currentUser._id }, { $push: { pets: id }}, function(err, raw) {
    if(err){
      console.log("error saving favorite pet " + err);
    } else {
      res.json({});
    }
  });
});

userRoutes.delete('/pets/:id', function(req, res, next) {
  let id = req.params.id;
  console.log(id);
  User.update({_id: req.currentUser._id}, { $pull: { pets: id}}, function(err, gif) {
    if(err){
      return next(err);
    } else {
      res.json({title: 'Pet was deleted'});
    }
  });
});

userRoutes.get('/userData', function(req, res, next) {
  User.findOne({ _id: req.currentUser._id }).populate('pets').exec(function (err, user) {
    if(err) {
      return next(err);
    } else {
      res.json(user);
    }
  });
});

export default userRoutes;
