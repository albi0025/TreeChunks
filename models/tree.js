import mongoose from 'mongoose';

let TreeSchema = new mongoose.Schema({
  title: String,
  chunk: {type: mongoose.Schema.Types.ObjectId, ref: 'Chunk'},
  cover: String,
  popularity: Number
});

export default mongoose.model('Tree', TreeSchema);
