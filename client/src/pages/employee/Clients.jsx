import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import useAuthStore from '../../store/authStore';
import { FiPlus, FiBriefcase, FiPhone, FiMail } from 'react-icons/fi';

const Clients = () => {
  const { user } = useAuthStore();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    companyName: '', contactPerson: '', email: '', phone: '', industry: '' 
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Hitting the employee clients endpoint
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/employee/clients`, config);
      setClients(data);
    } catch (error) {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/employee/clients`, formData, config);
      toast.success('Client registered successfully!');
      setShowModal(false);
      setFormData({ companyName: '', contactPerson: '', email: '', phone: '', industry: '' });
      fetchClients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register client');
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Client Management</h1>
          <p className="text-slate-500 mt-1">Manage your registered clients and companies.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
          <FiPlus className="mr-2" /> Register Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-slate-500">Loading clients...</p>
        ) : clients.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center">
            <FiBriefcase className="mx-auto text-4xl text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-800">No clients yet</h3>
            <p className="text-slate-500 mt-1">Click the button above to register your first client.</p>
          </div>
        ) : (
          clients.map(client => (
            <div key={client._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xl mr-4">
                  {client.companyName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{client.companyName}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {client.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
                <div className="flex items-center text-slate-600">
                  <FiBriefcase className="mr-3 text-slate-400" />
                  <span className="font-medium text-slate-800 mr-2">Contact:</span> {client.contactPerson}
                </div>
                <div className="flex items-center text-slate-600">
                  <FiMail className="mr-3 text-slate-400" />
                  <a href={`mailto:${client.email}`} className="text-primary-600 hover:underline">{client.email}</a>
                </div>
                <div className="flex items-center text-slate-600">
                  <FiPhone className="mr-3 text-slate-400" />
                  {client.phone}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Register New Client</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input required type="text" className="input-field" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                <input required type="text" className="input-field" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input required type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input required type="text" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                <input type="text" className="input-field" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Clients;
