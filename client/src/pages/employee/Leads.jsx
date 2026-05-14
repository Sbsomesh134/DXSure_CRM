import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import useAuthStore from '../../store/authStore';

const Leads = () => {
  const { user } = useAuthStore();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/employee/leads`, config);
        setLeads(data);
      } catch (error) {
        toast.error('Failed to load leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [user.token]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Leads</h1>
        <p className="text-slate-500 mt-1">Track your lead pipeline and active opportunities.</p>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <p className="text-slate-500">Loading leads...</p>
        ) : leads.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-100 text-center">
            <p className="text-slate-600">No leads yet. New opportunities will appear here.</p>
          </div>
        ) : (
          leads.map((lead) => (
            <div key={lead._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">{lead.name}</h2>
                  <p className="text-slate-500 text-sm">{lead.email} · {lead.phone}</p>
                </div>
                <span className="text-sm rounded-full px-3 py-1 bg-slate-100 text-slate-700">{lead.status}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
                <div><strong>Source:</strong> {lead.source}</div>
                <div><strong>Assigned To:</strong> {lead.assignedTo?.name || 'You'}</div>
                <div><strong>Created:</strong> {new Date(lead.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Leads;
