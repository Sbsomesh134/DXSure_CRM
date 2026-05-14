import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    source: { type: String, default: 'Website' },
    status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'], default: 'New' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: [{ text: String, date: { type: Date, default: Date.now } }]
  },
  { timestamps: true }
);

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
