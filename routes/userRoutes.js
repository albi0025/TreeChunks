import React from 'react';
import webpack from 'webpack';
import hash from 'password-hash';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import express from 'express';
import request from 'request';

let userRoutes = express.Router();
let app = express();

userRoutes.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
});

userRoutes.post('/newUser', function(req, res) {
  let token = req.headers.authorization.replace("Bearer", "").trim();
  let decoded = jwt.decode(token);
  User.findOne({ email: decoded.email }, function (err, user, next) {
    if(err) {
      return next(err);
    } else {
      if(user == null) {
        let user = new User();
        user.name = decoded.given_name;
        user.email = decoded.email;
        user.save(function(err, user){
          if(err){
            res.send(err);
          } else {
            res.json(user);
          }
        });
      } else {
        res.json(user);
      }
    }
  });
});

userRoutes.put('/flagUpChunk', function(req, res) {
  User.update({ _id: req.body.userId }, { $push: { upchunks: req.body.chunkId }}, function(err, raw) {
    if(err){
      console.log("error up chunking " + err);
    } else {
      res.json(req.body.chunkId);
    }
  });
});

userRoutes.put('/unFlagUpChunk', function(req, res) {
  User.update({ _id: req.body.userId }, { $pull: { upchunks: req.body.chunkId }}, function(err, raw) {
    if(err){
      console.log("error un chunking " + err);
    } else {
      res.json(req.body.chunkId);
    }
  });
});

userRoutes.put('/flagDownChunk', function(req, res) {
  User.update({ _id: req.body.userId }, { $push: { downchunks: req.body.chunkId }}, function(err, raw) {
    if(err){
      console.log("error downchunking " + err);
    } else {
      res.json(req.body.chunkId);
    }
  });
});

userRoutes.put('/unFlagDownChunk', function(req, res) {
  User.update({ _id: req.body.userId }, { $pull: { downchunks: req.body.chunkId }}, function(err, raw) {
    if(err){
      console.log("error undownchunking " + err);
    } else {
      res.json(req.body.chunkId);
    }
  });
});

userRoutes.put('/followTree', function(req, res) {
  User.update({ _id: req.body.userId }, { $push: { trees: req.body.treeId }}, function(err, raw) {
    if(err){
      console.log("error following tree " + err);
    } else {
      res.json(req.body.treeId);
    }
  });
});

userRoutes.put('/unFollowTree', function(req, res) {
  User.update({ _id: req.body.userId }, { $pull: { trees: req.body.treeId }}, function(err, raw) {
    if(err){
      console.log("error unfollowing tree " + err);
    } else {
      res.json(req.body.treeId);
    }
  });
});
//---------Start middleware--------------------

//route middleware to verify a token
userRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  let token = req.headers.authorization.replace("Bearer", "").trim();
  if (token) {
    let url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + token;
    request(url, function (err, tokenResponse, body) {
      // if (body.error_description == "Invalid Value") {
      if (JSON.parse(body).error_description) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        console.log(body);
        next();
      }
    });
  } else {
    //if there is no token
    //return an error
    return res.status(403).send({
      success: false,
      message: 'no token provided'
    });
  }
});
//---------End middleware--------------------

userRoutes.get('/getUser', function(req, res, next) {
  let token = req.headers.authorization.replace("Bearer", "").trim();
  let decoded = jwt.decode(token);
  User.findOne({ email: decoded.email }, function (err, user) {
    if(err) {
      return next(err);
    } else {
      res.json(user);
    }
  });
});

export default userRoutes;
