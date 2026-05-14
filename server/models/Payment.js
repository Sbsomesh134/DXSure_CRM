import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    invoiceNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Paid', 'Overdue'], default: 'Pending' },
    dueDate: { type: Date, required: true },
    paymentDate: { type: Date },
    paymentMethod: { type: String, enum: ['Bank Transfer', 'Credit Card', 'Cash', 'Other'] },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
