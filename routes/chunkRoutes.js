import React from 'react';
import Tree from '../models/tree';
import Chunk from '../models/chunk';
import express from 'express';

let chunkRoutes = express.Router();
let app = express();

chunkRoutes.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
});

chunkRoutes.post('/newChunk', function(req, res) {
  let chunk = new Chunk();
  chunk.parentchunk = req.body.parentchunk;
  chunk.content = req.body.content;
  chunk.popularity = 0;
  chunk.owner = req.body.owner;
  chunk.date = req.body.date;

  chunk.save(function(err, chunk){
    if(err){
      res.send(err);
    } else {
      res.json(chunk);
    }
  });
});

chunkRoutes.put('/newChildChunk', function(req, res) {
  Chunk.update({ _id: req.body.parentId }, { $push: { children: req.body.childId }}, function(err, raw) {
    if(err){
      console.log("error adding child " + err);
    } else {
      res.json(req.body.childId);
    }
  });
});

chunkRoutes.get('/getStory/:chunkid', function(req, res, next) {
  Chunk.findById(req.params.chunkid, function(err, chunk){
    if(err){
      return next(err);
    }else{
      res.json(chunk);
    }
  });
});

chunkRoutes.get('/getChunk/:chunkid', function(req, res, next) {
  Chunk.findById(req.params.chunkid, function(err, chunk){
    if(err){
      return next(err);
    }else{
      res.json(chunk);
    }
  });
});

chunkRoutes.get('/getMostPopularChild/:chunkid', function(req, res, next) {
  Chunk.findById(req.params.chunkid).populate('children').exec(function(err, chunk){
    if(err){
      return next(err);
    }else{
      let children = chunk.children;
      children.sort(function(childA, childB){
        return childB.popularity-childA.popularity;
      });
      res.json(children[0]);
    }
  });
});


chunkRoutes.get('/getChunks/:parentId', function(req, res) {
  Chunk.find({"parentchunk": req.params.parentId}).sort({popularity: "descending"}).exec( function(err, chunks){
    if(err){
      res.send(err);
    } else {
      res.json(chunks);
    }
  });
});



export default chunkRoutes;
