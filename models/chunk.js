import mongoose from 'mongoose';

let ChunkSchema = new mongoose.Schema({
  parentchunk: mongoose.Schema.Types.ObjectId,
  content: String,
  popularity: Number,
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  date: Date,
  tags: String
});

export default mongoose.model('Chunk', ChunkSchema);
