import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import useAuthStore from '../../store/authStore';

const DayPlans = () => {
  const { user } = useAuthStore();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/dayplans`, config);
        setPlans(data);
      } catch (error) {
        toast.error('Failed to load day plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [user.token]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Day Plans</h1>
        <p className="text-slate-500 mt-1">View all employee day plans submitted to HR.</p>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <p className="text-slate-500">Loading day plans...</p>
        ) : plans.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-100 text-center">
            <p className="text-slate-600">No day plans found yet.</p>
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">{plan.employee?.name || 'Employee'}</h2>
                  <p className="text-slate-500 text-sm">{plan.employee?.email || ''}</p>
                </div>
                <span className="text-sm text-slate-500">{new Date(plan.date).toLocaleDateString()}</span>
              </div>
              <div className="space-y-2 text-sm text-slate-700">
                {plan.tasks.length > 0 ? (
                  plan.tasks.map((task, idx) => (
                    <div key={idx} className="rounded-lg bg-slate-50 p-3">
                      <div className="font-medium">{task.title}</div>
                      {task.description && <div className="text-slate-500 mt-1">{task.description}</div>}
                      <div className="text-xs text-slate-400 mt-1">Status: {task.status}</div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg bg-slate-50 p-3 text-slate-500">No tasks submitted.</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default DayPlans;
