import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import Client from '../models/Client.js';
import ActivityLog from '../models/ActivityLog.js';
import DayPlan from '../models/DayPlan.js';
import Payment from '../models/Payment.js';
import Expense from '../models/Expense.js';

// @desc    Get Dashboard KPIs
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getAdminDashboard = asyncHandler(async (req, res) => {
  const employeesCount = await User.countDocuments({ role: 'Employee' });
  const ticketsCount = await Ticket.countDocuments({ status: 'Open' });
  const clientsCount = await Client.countDocuments();
  const recentLogs = await ActivityLog.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name');

  res.json({
    employeesCount,
    ticketsCount,
    clientsCount,
    recentLogs
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Create new user (employee)
// @route   POST /api/admin/users
// @access  Private/Admin
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'Employee',
  });

  if (user) {
    await ActivityLog.create({
      user: req.user._id,
      action: 'Created User',
      description: `Created user account for ${email}`
    });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get all DayPlans
// @route   GET /api/admin/dayplans
// @access  Private/Admin
export const getDayPlans = asyncHandler(async (req, res) => {
  const plans = await DayPlan.find().populate('employee', 'name email').sort({ date: -1 });
  res.json(plans);
});

// @desc    Get all activity logs
// @route   GET /api/admin/logs
// @access  Private/Admin
export const getActivityLogs = asyncHandler(async (req, res) => {
  const logs = await ActivityLog.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(logs);
});

// @desc    Get DayBook report
// @route   GET /api/admin/daybook
// @access  Private/Admin
export const getDayBook = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate('client', 'companyName')
    .populate('recordedBy', 'name')
    .sort({ dueDate: -1 });

  const expenses = await Expense.find()
    .populate('submittedBy', 'name')
    .sort({ date: -1 });

  const totalPaid = payments
    .filter((payment) => payment.status === 'Paid')
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  const totalDue = payments
    .filter((payment) => payment.status !== 'Paid')
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

  res.json({ payments, expenses, totals: { totalPaid, totalDue, totalExpenses } });
});

// @desc    Get all Tickets
// @route   GET /api/admin/tickets
// @access  Private/Admin
export const getTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find()
    .populate('assignedTo', 'name')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.json(tickets);
});
