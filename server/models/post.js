import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Post = new Schema({
  writer: {
    _id: { type: Schema.Types.ObjectId, ref: 'account' }
  },
  title: String,
  content: String,
  openRange: String,
  tags: [String],
  files: [{
    _id: { type: Schema.Types.ObjectId, ref: 'files' }
  }],
  created: { type: Date, default: Date.now },
  modified: Date,
  deprecated: Date
});

export default mongoose.model('post', Post);