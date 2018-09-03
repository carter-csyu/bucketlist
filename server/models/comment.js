import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Comment = new Schema({
  article: { type: Schema.Types.ObjectId, ref: 'article' },
  writer: { type: Schema.Types.ObjectId, ref: 'account' },
  content: String,
  created: { type: Date, default: Date.now },
  deprecated: Date
});

export default mongoose.model('comment', Comment);