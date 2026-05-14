import express from 'express';
import { getAdminDashboard, getUsers, createUser, getDayPlans, getActivityLogs, getDayBook, getTickets } from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect, admin); // Secure all admin routes

router.route('/dashboard').get(getAdminDashboard);
router.route('/users').get(getUsers).post(createUser);
router.route('/dayplans').get(getDayPlans);
router.route('/logs').get(getActivityLogs);
router.route('/daybook').get(getDayBook);
router.route('/tickets').get(getTickets);

export default router;
