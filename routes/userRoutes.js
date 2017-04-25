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

// route middleware to verify a token
// userRoutes.use(function(req, res, next) {
//   // check header or url parameters or post parameters for token
//   let token = req.headers.authorization.replace("Bearer", "").trim();
//   // decode token
//   if (token) {
//     // verifies secret and checks exp
//     jwt.verify(token, app.get('superSecret'), function(err, decoded) {
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });
//       } else {
//         // if everything is good, save to request for use in other routes
//         // req.decoded = decoded;
//         req.currentUser = decoded._doc;
//         next();
//       }
//     });
//   } else {
//     // if there is no token
//     // return an error
//     return res.status(403).send({
//       success: false,
//       message: 'No token provided.'
//     });
//
//   }
// });

//---------End middleware--------------------

// userRoutes.post('/pets', function(req, res) {
//   let id = req.body.id;
//   User.update({ _id: req.currentUser._id }, { $push: { pets: id }}, function(err, raw) {
//     if(err){
//       console.log("error saving favorite pet " + err);
//     } else {
//       res.json({});
//     }
//   });
// });
//
// userRoutes.delete('/pets/:id', function(req, res, next) {
//   let id = req.params.id;
//   console.log(id);
//   User.update({_id: req.currentUser._id}, { $pull: { pets: id}}, function(err, gif) {
//     if(err){
//       return next(err);
//     } else {
//       res.json({title: 'Pet was deleted'});
//     }
//   });
// });
//
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
