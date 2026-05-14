import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import useAuthStore from '../../store/authStore';
import { FiFileText, FiCheckSquare, FiTrendingUp } from 'react-icons/fi';

const EmployeeDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    openTicketsCount: 0,
    tasksCount: 0,
    activeLeadsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/employee/dashboard`, config);
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
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Employee Dashboard</h1>
        <p className="text-slate-500 mt-1">Hello, {user?.name.split(' ')[0]}! Here is your summary for today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="My Open Tickets" 
          value={stats.openTicketsCount} 
          icon={<FiFileText size={24} className="text-orange-600" />} 
          colorClass="bg-orange-50" 
        />
        <StatCard 
          title="Today's Tasks" 
          value={stats.tasksCount} 
          icon={<FiCheckSquare size={24} className="text-blue-600" />} 
          colorClass="bg-blue-50" 
        />
        <StatCard 
          title="Active Leads" 
          value={stats.activeLeadsCount} 
          icon={<FiTrendingUp size={24} className="text-green-600" />} 
          colorClass="bg-green-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="btn-secondary w-full text-left justify-start flex flex-col py-4">
              <FiCheckSquare className="mb-2 text-xl text-primary-500" />
              <span>Submit DayPlan</span>
            </button>
            <button className="btn-secondary w-full text-left justify-start flex flex-col py-4">
              <FiFileText className="mb-2 text-xl text-orange-500" />
              <span>Raise Ticket</span>
            </button>
            <button className="btn-secondary w-full text-left justify-start flex flex-col py-4">
              <FiTrendingUp className="mb-2 text-xl text-green-500" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;
