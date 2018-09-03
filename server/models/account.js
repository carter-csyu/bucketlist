import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const Account = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: String,
  nickname: { type: String, required: true, unique: true},
  bio: String,
  profileImage: String,
  posts: [{ type: Schema.Types.ObjectId, ref: 'article'}],
  bucketlists: [{ type: Schema.Types.ObjectId, ref: 'article'}],
  followers: [{ type: Schema.Types.ObjectId, ref: 'account' }],
  followees: [{ type: Schema.Types.ObjectId, ref: 'account' }],
  created: { type: Date, default: Date.now },
  modified: Date,
  deprecated: Date
});

Account.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, 8);
};

Account.methods.validateHash =  function(password) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('account', Account);
