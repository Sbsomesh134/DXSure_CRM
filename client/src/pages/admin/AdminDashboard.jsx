import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import useAuthStore from '../../store/authStore';
import { FiUsers, FiFileText, FiBriefcase, FiActivity } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    employeesCount: 0,
    ticketsCount: 0,
    clientsCount: 0,
    recentLogs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/dashboard`, config);
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.token]);

  const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-slate-800 mt-2">{loading ? '-' : value}</p>
      </div>
      <div className={`p-4 rounded-full ${colorClass}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back to the DXSure CRM, {user?.name.split(' ')[0]}!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Employees" 
          value={stats.employeesCount} 
          icon={<FiUsers size={24} className="text-blue-600" />} 
          colorClass="bg-blue-50" 
        />
        <StatCard 
          title="Active Tickets" 
          value={stats.ticketsCount} 
          icon={<FiFileText size={24} className="text-orange-600" />} 
          colorClass="bg-orange-50" 
        />
        <StatCard 
          title="Total Clients" 
          value={stats.clientsCount} 
          icon={<FiBriefcase size={24} className="text-green-600" />} 
          colorClass="bg-green-50" 
        />
        <StatCard 
          title="Recent Activity" 
          value={stats.recentLogs.length} 
          icon={<FiActivity size={24} className="text-purple-600" />} 
          colorClass="bg-purple-50" 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Recent Activity Logs</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-6 text-center text-slate-500">Loading activity logs...</div>
          ) : stats.recentLogs.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No recent activity.</div>
          ) : (
            stats.recentLogs.map((log) => (
              <div key={log._id} className="p-6 flex items-start space-x-4 hover:bg-slate-50 transition-colors">
                <div className="p-2 bg-slate-100 rounded-full text-slate-500">
                  <FiActivity />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{log.action}</p>
                  <p className="text-sm text-slate-500 mt-1">{log.description}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(log.createdAt).toLocaleString()} • by {log.user?.name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
