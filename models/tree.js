import mongoose from 'mongoose';

let TreeSchema = new mongoose.Schema({
  title: String,
  chunk: {type: mongoose.Schema.Types.ObjectId, ref: 'Chunk'},
  cover: String,
  popularity: Number,
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  date: Date,
  maxWords: Number
});

export default mongoose.model('Tree', TreeSchema);
