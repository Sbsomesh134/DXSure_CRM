import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import DayPlans from './pages/admin/DayPlans';
import ActivityLogs from './pages/admin/ActivityLogs';
import DayBook from './pages/admin/DayBook';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import DayPlan from './pages/employee/DayPlan';
import Enquiries from './pages/employee/Enquiries';
import Vendors from './pages/employee/Vendors';
import Payments from './pages/employee/Payments';
import Leads from './pages/employee/Leads';
import Tickets from './pages/Tickets';
import Clients from './pages/employee/Clients';
import Pettycash from './pages/employee/Pettycash';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="tickets" element={<Tickets />} />
                  <Route path="dayplans" element={<DayPlans />} />
                  <Route path="logs" element={<ActivityLogs />} />
                  <Route path="daybook" element={<DayBook />} />
                </Routes>
              </ProtectedRoute>
            } 
          />
          
          {/* Employee Routes */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute allowedRoles={['Employee', 'Admin']}>
                <Routes>
                  <Route index element={<EmployeeDashboard />} />
                  <Route path="dayplan" element={<DayPlan />} />
                  <Route path="enquiries" element={<Enquiries />} />
                  <Route path="vendors" element={<Vendors />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="pettycash" element={<Pettycash />} />
                  <Route path="tickets" element={<Tickets />} />
                  <Route path="leads" element={<Leads />} />
                </Routes>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
