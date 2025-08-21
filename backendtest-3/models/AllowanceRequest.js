import mongoose from 'mongoose';

const AllowanceRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
});

const AllowanceRequest = mongoose.model('AllowanceRequest', AllowanceRequestSchema);
export default AllowanceRequest;
