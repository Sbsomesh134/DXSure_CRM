import asyncHandler from 'express-async-handler';
import Ticket from '../models/Ticket.js';
import DayPlan from '../models/DayPlan.js';
import Client from '../models/Client.js';
import Lead from '../models/Lead.js';
import Enquiry from '../models/Enquiry.js';
import Vendor from '../models/Vendor.js';
import Payment from '../models/Payment.js';

// @desc    Get Employee Dashboard Data
// @route   GET /api/employee/dashboard
// @access  Private
export const getEmployeeDashboard = asyncHandler(async (req, res) => {
  const openTicketsCount = await Ticket.countDocuments({ assignedTo: req.user._id, status: 'Open' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayPlan = await DayPlan.findOne({ employee: req.user._id, date: { $gte: today } });
  const tasksCount = todayPlan ? todayPlan.tasks.length : 0;
  
  const activeLeadsCount = await Lead.countDocuments({ assignedTo: req.user._id, status: { $in: ['New', 'Contacted'] } });

  res.json({
    openTicketsCount,
    tasksCount,
    activeLeadsCount
  });
});

// @desc    Get my tickets
// @route   GET /api/employee/tickets
// @access  Private
export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ assignedTo: req.user._id });
  res.json(tickets);
});

// @desc    Get or create today's DayPlan
// @route   GET /api/employee/dayplan
// @access  Private
export const getMyDayPlan = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const plan = await DayPlan.findOne({
    employee: req.user._id,
    date: { $gte: today, $lt: tomorrow }
  });
  res.json(plan || { employee: req.user._id, date: today.toISOString().slice(0, 10), tasks: [] });
});

// @desc    Get or create today's DayPlan
// @route   POST /api/employee/dayplan
// @access  Private
export const saveDayPlan = asyncHandler(async (req, res) => {
  const { tasks, date } = req.body;
  const normalizedTasks = (tasks || [])
    .filter((task) => (typeof task === 'string' ? task.trim() : task?.title?.trim()))
    .map((task) => {
      if (typeof task === 'string') {
        return { title: task.trim(), status: 'Pending' };
      }
      return {
        title: task.title?.trim(),
        description: task.description || '',
        status: task.status || 'Pending'
      };
    });

  const planDate = new Date(date);
  planDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(planDate);
  nextDay.setDate(nextDay.getDate() + 1);

  let plan = await DayPlan.findOne({
    employee: req.user._id,
    date: { $gte: planDate, $lt: nextDay }
  });
  
  if (plan) {
    plan.tasks = normalizedTasks;
    await plan.save();
  } else {
    plan = await DayPlan.create({
      employee: req.user._id,
      date: planDate,
      tasks: normalizedTasks,
      status: 'Submitted'
    });
  }
  
  res.status(201).json(plan);
});

// @desc    Get all enquiries for the employee
// @route   GET /api/employee/enquiries
// @access  Private
export const getMyEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find({
    $or: [
      { assignedTo: req.user._id },
      { createdBy: req.user._id }
    ]
  })
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });
  res.json(enquiries);
});

// @desc    Create a new enquiry
// @route   POST /api/employee/enquiries
// @access  Private
export const createEnquiry = asyncHandler(async (req, res) => {
  const { clientName, contactEmail, contactPhone, subject, message, followUpDate } = req.body;
  const enquiry = await Enquiry.create({
    clientName,
    contactEmail,
    contactPhone,
    subject,
    message,
    followUpDate,
    createdBy: req.user._id,
    assignedTo: req.user._id
  });
  res.status(201).json(enquiry);
});

// @desc    Get vendors created by the employee
// @route   GET /api/employee/vendors
// @access  Private
export const getMyVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
  res.json(vendors);
});

// @desc    Create a new vendor
// @route   POST /api/employee/vendors
// @access  Private
export const createVendor = asyncHandler(async (req, res) => {
  const { name, contactPerson, email, phone, category, address } = req.body;
  const vendorExists = await Vendor.findOne({ email });
  if (vendorExists) {
    res.status(400);
    throw new Error('Vendor with this email already exists');
  }
  const vendor = await Vendor.create({
    name,
    contactPerson,
    email,
    phone,
    category,
    address,
    createdBy: req.user._id
  });
  res.status(201).json(vendor);
});

// @desc    Get payments recorded by the employee
// @route   GET /api/employee/payments
// @access  Private
export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ recordedBy: req.user._id })
    .populate('client', 'companyName')
    .sort({ createdAt: -1 });
  res.json(payments);
});

// @desc    Record a new payment
// @route   POST /api/employee/payments
// @access  Private
export const createPayment = asyncHandler(async (req, res) => {
  const { client, invoiceNumber, amount, status, dueDate, paymentDate, paymentMethod } = req.body;
  const payment = await Payment.create({
    client,
    invoiceNumber,
    amount,
    status,
    dueDate,
    paymentDate,
    paymentMethod,
    recordedBy: req.user._id
  });
  res.status(201).json(payment);
});

// @desc    Get my leads
// @route   GET /api/employee/leads
// @access  Private
export const getMyLeads = asyncHandler(async (req, res) => {
  const leads = await Lead.find({
    $or: [
      { assignedTo: req.user._id },
      { createdBy: req.user._id }
    ]
  })
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });
  res.json(leads);
});

// @desc    Get Clients assigned to me
// @route   GET /api/employee/clients
// @access  Private
export const getMyClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({ assignedTo: req.user._id });
  res.json(clients);
});

// @desc    Register a new client
// @route   POST /api/employee/clients
// @access  Private
export const createClient = asyncHandler(async (req, res) => {
  const { companyName, contactPerson, email, phone, industry } = req.body;

  const clientExists = await Client.findOne({ email });
  if (clientExists) {
    res.status(400);
    throw new Error('Client with this email already exists');
  }

  const client = await Client.create({
    companyName,
    contactPerson,
    email,
    phone,
    industry,
    assignedTo: req.user._id,
    createdBy: req.user._id,
  });

  res.status(201).json(client);
});
