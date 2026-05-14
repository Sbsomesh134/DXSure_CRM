import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    website: { type: String },
    industry: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: [{ text: String, date: { type: Date, default: Date.now } }]
  },
  { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);
export default Client;
