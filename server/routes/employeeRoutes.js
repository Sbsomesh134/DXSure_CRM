import express from 'express';
import {
  getEmployeeDashboard,
  getMyTickets,
  getMyDayPlan,
  saveDayPlan,
  getMyClients,
  createClient,
  getMyEnquiries,
  createEnquiry,
  getMyVendors,
  createVendor,
  getMyPayments,
  createPayment,
  getMyLeads
} from '../controllers/employeeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all employee routes

router.route('/dashboard').get(getEmployeeDashboard);
router.route('/tickets').get(getMyTickets);
router.route('/dayplan').get(getMyDayPlan).post(saveDayPlan);
router.route('/clients').get(getMyClients).post(createClient);
router.route('/enquiries').get(getMyEnquiries).post(createEnquiry);
router.route('/vendors').get(getMyVendors).post(createVendor);
router.route('/payments').get(getMyPayments).post(createPayment);
router.route('/leads').get(getMyLeads);

export default router;
