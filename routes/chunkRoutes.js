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

  chunk.save(function(err, chunk){
    if(err){
      res.send(err);
    } else {
      res.json(chunk);
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
