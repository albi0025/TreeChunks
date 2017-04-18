import mongoose from 'mongoose';

let ChunkSchema = new mongoose.Schema({
  parentchunk: mongoose.Schema.Types.ObjectId,
  content: String,
  popularity: Number
});

export default mongoose.model('Chunk', ChunkSchema);
