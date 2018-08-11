import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const Account = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: String,
  nickname: String,
  bio: String,
  profileImage: String,
  followers: [{
    _id: { type: Schema.Types.ObjectId, ref: 'account' }
  }],
  followees: [{
    _id: { type: Schema.Types.ObjectId, ref: 'account' }
  }],
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