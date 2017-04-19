import React from 'react';
import Tree from '../models/tree';
import Chunk from '../models/chunk';
import express from 'express';

let treeRoutes = express.Router();
let app = express();

treeRoutes.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
});

treeRoutes.post('/newTree', function(req, res) {
  let chunk = new Chunk();
  chunk.content = req.body.content;
  chunk.popularity = 0;

  chunk.save(function(err, chunk){
    if(err){
      res.send(err);
    } else {
      let tree = new Tree();
      tree.title = req.body.title;
      tree.chunk = chunk._id;
      tree.cover = req.body.cover;
      tree.popularity = 0;
      tree.save(function(err, tree){
        if(err){
          res.send(err);
        } else {
          res.json(tree);
        }
      });
    }
  });
});

treeRoutes.get('/getTrees', function(req, res, next) {
  Tree.find().sort({popularity: "descending"}).populate('chunk').exec(function(err, trees){
    if(err){
      return next(err);
    }else{
      res.json(trees);
    }
  });
});

treeRoutes.get('/getChunk/:chunkid', function(req, res, next) {
  Chunk.findById(req.params.chunkid, function(err, chunk){
    if(err){
      return next(err);
    }else{
      res.json(chunk);
    }
  });
});


treeRoutes.put('/adjustChunk', function(req, res, next) {
  Chunk.update({_id: req.body.chunkId}, { $inc: { popularity: req.body.adjustment }},
    function(err, chunk) {
      if(err) {
        return next(err);
      } else {
        res.json(chunk);
      }
    });
});

treeRoutes.put('/adjustTree', function(req, res, next) {
  console.log(req.body.chunkId);
  Tree.update({_id: req.body.chunkId}, { $inc: { popularity: req.body.adjustment }},
    function(err, chunk) {
      if(err) {
        return next(err);
      } else {
        res.json(chunk);
      }
    });
});

treeRoutes.get('/getTree/:treeId', function(req, res, next) {
  Tree.findById(req.params.treeId).populate('chunk').exec(function(err, tree){
    if(err){
      return next(err);
    }else{
      res.json(tree);
    }
  });
});




export default treeRoutes;
