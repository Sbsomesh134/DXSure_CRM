import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import useAuthStore from '../../store/authStore';

const ActivityLogs = () => {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/logs`, config);
        setLogs(data);
      } catch (error) {
        toast.error('Failed to load activity logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user.token]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Activity Logs</h1>
        <p className="text-slate-500 mt-1">Review recent user and system activity.</p>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <p className="text-slate-500">Loading activity logs...</p>
        ) : logs.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-100 text-center">
            <p className="text-slate-600">No activity logs available yet.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">{log.action}</h2>
                  <p className="text-slate-500 text-sm">{log.description}</p>
                </div>
                <span className="text-sm text-slate-500">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-slate-600">Performed by: {log.user?.name || 'Unknown'}</p>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default ActivityLogs;
