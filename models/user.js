import mongoose from 'mongoose';

let UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  upchunks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chunk'}],
  downchunks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chunk'}],
  trees: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tree'}]
});

export default mongoose.model('User', UserSchema);
