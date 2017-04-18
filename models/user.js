let mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  subscribed: { type: Boolean, default: false },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }]
});

export default mongoose.model('User', UserSchema);
