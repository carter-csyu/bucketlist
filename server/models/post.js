import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Post = new Schema({
  writer: { type: Schema.Types.ObjectId, ref: 'account' },
  title: String,
  content: String,
  openRange: String,
  tags: [String],
  files: [{ type: Schema.Types.ObjectId, ref: 'file' }],
  created: { type: Date, default: Date.now },
  modified: Date,
  deprecated: Date
});

export default mongoose.model('post', Post);