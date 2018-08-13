import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Article = new Schema({
  writer: { type: Schema.Types.ObjectId, ref: 'account' },
  type: String,
  title: String,
  content: String,
  items: [{
    name: String,
    done: Boolean
  }],
  tags: [String],
  files: [{ type: Schema.Types.ObjectId, ref: 'file' }],
  dueDate: Date,
  openRange: String,
  created: { type: Date, default: Date.now },
  modifed: { type: Date, default: Date.now },
  deprecated: Date
});

export default mongoose.model('article', Article);