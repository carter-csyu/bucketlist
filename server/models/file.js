import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const File = new Schema({
  writer: {
    _id: { type: Schema.Types.ObjectId, ref: 'account' }
  },
  fileName: String,
  fileSize: String,
  fileType: String,
  realFileName: String,
  created: { type: String, default: Date.now }
});

export default mongoose.model('file', File);