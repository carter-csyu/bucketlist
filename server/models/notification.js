import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Notification = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'account' },
  to: { type: Schema.Types.ObjectId, ref: 'account'},
  type: String, // tag, comment, like
  article: { type: Schema.Types.ObjectId, ref: 'article'},
  read: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  deprecated: Date
});

export default mongoose.model('notification', Notification);