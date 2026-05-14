import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Client from './models/Client.js';
import DayPlan from './models/DayPlan.js';
import Enquiry from './models/Enquiry.js';
import Lead from './models/Lead.js';
import Ticket from './models/Ticket.js';
import Vendor from './models/Vendor.js';
import Payment from './models/Payment.js';
import Expense from './models/Expense.js';
import ActivityLog from './models/ActivityLog.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Promise.all([
      User.deleteMany(),
      Client.deleteMany(),
      DayPlan.deleteMany(),
      Enquiry.deleteMany(),
      Lead.deleteMany(),
      Ticket.deleteMany(),
      Vendor.deleteMany(),
      Payment.deleteMany(),
      Expense.deleteMany(),
      ActivityLog.deleteMany(),
    ]);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@dxsure.com',
      password: 'password123',
      role: 'Admin',
    });

    const employeeUser = await User.create({
      name: 'John Doe',
      email: 'employee@dxsure.com',
      password: 'password123',
      role: 'Employee',
    });

    const clients = await Client.create([
      {
        companyName: 'Apex Solutions',
        contactPerson: 'Ravi Patel',
        email: 'ravi@apexsolutions.com',
        phone: '+91 98100 12345',
        address: 'Mumbai, India',
        website: 'https://apexsolutions.com',
        industry: 'Technology',
        status: 'Active',
        assignedTo: employeeUser._id,
        createdBy: employeeUser._id,
      },
      {
        companyName: 'Zenith Retail',
        contactPerson: 'Priya Sharma',
        email: 'priya@zenithretail.com',
        phone: '+91 98100 54321',
        address: 'Bengaluru, India',
        website: 'https://zenithretail.com',
        industry: 'Retail',
        status: 'Active',
        assignedTo: employeeUser._id,
        createdBy: employeeUser._id,
      }
    ]);

    const dayPlans = await DayPlan.create([
      {
        employee: employeeUser._id,
        date: new Date(),
        tasks: [
          { title: 'Client follow-up call', description: 'Reach out to Apex Solutions for contract renewal', status: 'Pending' },
          { title: 'Prepare proposal', description: 'Update pricing for Zenith Retail quarterly package', status: 'In Progress' },
        ],
        status: 'Submitted',
        adminFeedback: 'Great progress, please capture next steps in notes',
      }
    ]);

    const enquiries = await Enquiry.create([
      {
        clientName: 'Apex Solutions',
        contactEmail: 'ravi@apexsolutions.com',
        contactPhone: '+91 98100 12345',
        subject: 'Product integration request',
        message: 'Need details about integrating CRM with our internal ERP.',
        status: 'Open',
        assignedTo: employeeUser._id,
        createdBy: employeeUser._id,
        followUpDate: new Date(new Date().setDate(new Date().getDate() + 2)),
      },
      {
        clientName: 'Zenith Retail',
        contactEmail: 'priya@zenithretail.com',
        contactPhone: '+91 98100 54321',
        subject: 'Support for lead upload',
        message: 'Request assistance with importing new leads into CRM.',
        status: 'In Progress',
        assignedTo: employeeUser._id,
        createdBy: employeeUser._id,
        followUpDate: new Date(new Date().setDate(new Date().getDate() + 4)),
      }
    ]);

    const leads = await Lead.create([
      {
        name: 'Rohan Mehta',
        email: 'rohan.mehta@businessco.com',
        phone: '+91 98900 11122',
        source: 'Website',
        status: 'New',
        assignedTo: employeeUser._id,
        createdBy: employeeUser._id,
        notes: [{ text: 'Initial enquiry received from website form.' }]
      },
      {
        name: 'Sneha Gupta',
        email: 'sneha.gupta@brandmart.com',
        phone: '+91 98900 22233',
        source: 'Referral',
        status: 'Contacted',
        assignedTo: employeeUser._id,
        createdBy: employeeUser._id,
        notes: [{ text: 'Spoke about a demo for next Tuesday.' }]
      }
    ]);

    const tickets = await Ticket.create([
      {
        title: 'CRM login issue',
        description: 'User is unable to access the admin dashboard after login.',
        priority: 'High',
        status: 'Open',
        assignedTo: employeeUser._id,
        createdBy: employeeUser._id,
        comments: [{ text: 'Initial ticket created by employee.', postedBy: employeeUser._id }]
      },
      {
        title: 'Payment report missing rows',
        description: 'Some payments are not appearing in Day Book reports.',
        priority: 'Medium',
        status: 'In Progress',
        assignedTo: employeeUser._id,
        createdBy: adminUser._id,
        comments: [{ text: 'Please verify client mapping in payment records.', postedBy: adminUser._id }]
      }
    ]);

    const vendors = await Vendor.create([
      {
        name: 'Oceanic Supplies',
        contactPerson: 'Nisha Reddy',
        email: 'nisha@oceanicsupplies.com',
        phone: '+91 98765 43210',
        category: 'Office Supplies',
        address: 'Hyderabad, India',
        createdBy: employeeUser._id,
      },
      {
        name: 'Galaxy Systems',
        contactPerson: 'Aman Verma',
        email: 'aman@galaxysystems.com',
        phone: '+91 98765 12345',
        category: 'IT Services',
        address: 'Pune, India',
        createdBy: employeeUser._id,
      }
    ]);

    const payments = await Payment.create([
      {
        client: clients[0]._id,
        invoiceNumber: 'INV-2026-001',
        amount: 45000,
        status: 'Paid',
        dueDate: new Date(new Date().setDate(new Date().getDate() - 5)),
        paymentDate: new Date(new Date().setDate(new Date().getDate() - 2)),
        paymentMethod: 'Bank Transfer',
        recordedBy: employeeUser._id,
      },
      {
        client: clients[1]._id,
        invoiceNumber: 'INV-2026-002',
        amount: 75000,
        status: 'Pending',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
        paymentMethod: 'Credit Card',
        recordedBy: employeeUser._id,
      }
    ]);

    const expenses = await Expense.create([
      {
        title: 'Office extension purchase',
        amount: 12000,
        date: new Date(new Date().setDate(new Date().getDate() - 3)),
        category: 'Office',
        status: 'Approved',
        receipt: 'receipt-office-2026.jpg',
        submittedBy: employeeUser._id,
        approvedBy: adminUser._id,
        notes: 'Purchased extra chairs for the CRM training room.'
      },
      {
        title: 'Client lunch meeting',
        amount: 5800,
        date: new Date(new Date().setDate(new Date().getDate() - 1)),
        category: 'Meals',
        status: 'Pending',
        receipt: 'receipt-meals-2026.jpg',
        submittedBy: employeeUser._id,
        notes: 'Lunch meeting with Apex Solutions team.'
      }
    ]);

    await ActivityLog.create([
      {
        user: adminUser._id,
        action: 'User created',
        description: 'Admin user account created for initial setup.',
        ipAddress: '127.0.0.1'
      },
      {
        user: employeeUser._id,
        action: 'Client added',
        description: 'Employee created client records for Apex Solutions and Zenith Retail.',
        ipAddress: '127.0.0.1'
      },
      {
        user: employeeUser._id,
        action: 'Day plan submitted',
        description: 'Submitted initial day plan with two follow-up tasks.',
        ipAddress: '127.0.0.1'
      }
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Promise.all([
      User.deleteMany(),
      Client.deleteMany(),
      DayPlan.deleteMany(),
      Enquiry.deleteMany(),
      Lead.deleteMany(),
      Ticket.deleteMany(),
      Vendor.deleteMany(),
      Payment.deleteMany(),
      Expense.deleteMany(),
      ActivityLog.deleteMany(),
    ]);

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
