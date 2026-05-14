import mongoose from 'mongoose';

const dayPlanSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    tasks: [
      {
        title: { type: String, required: true },
        description: String,
        status: { type: String, enum: ['Pending', 'Completed', 'In Progress'], default: 'Pending' }
      }
    ],
    status: { type: String, enum: ['Draft', 'Submitted', 'Approved', 'Rejected'], default: 'Draft' },
    adminFeedback: { type: String }
  },
  { timestamps: true }
);

const DayPlan = mongoose.model('DayPlan', dayPlanSchema);
export default DayPlan;
