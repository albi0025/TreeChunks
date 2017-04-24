import mongoose from 'mongoose';

let UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

export default mongoose.model('User', UserSchema);
