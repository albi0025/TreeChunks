import mongoose from 'mongoose';

let TreeSchema = new mongoose.Schema({
  title: String,
  chunk: mongoose.Schema.Types.ObjectId,
  cover: String,
  popularity: Number
});

export default mongoose.model('Tree', TreeSchema);
