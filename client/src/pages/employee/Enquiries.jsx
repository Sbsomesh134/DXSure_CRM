import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import useAuthStore from '../../store/authStore';

const Enquiries = () => {
  const { user } = useAuthStore();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    contactEmail: '',
    contactPhone: '',
    subject: '',
    message: '',
    followUpDate: ''
  });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/employee/enquiries`, config);
      setEnquiries(data);
    } catch (error) {
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/employee/enquiries`, formData, config);
      toast.success('Enquiry submitted successfully');
      setShowModal(false);
      setFormData({ clientName: '', contactEmail: '', contactPhone: '', subject: '', message: '', followUpDate: '' });
      fetchEnquiries();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit enquiry');
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Enquiries</h1>
          <p className="text-slate-500 mt-1">View and raise customer enquiries.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          Create Enquiry
        </button>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <p className="text-slate-500">Loading enquiries...</p>
        ) : enquiries.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-100 text-center">
            <p className="text-slate-600">No enquiries yet. Create one to get started.</p>
          </div>
        ) : (
          enquiries.map((enquiry) => (
            <div key={enquiry._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-slate-800">{enquiry.subject}</h2>
                <span className="text-sm text-slate-500">{new Date(enquiry.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-500 mb-3">{enquiry.message}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
                <div><strong>Client:</strong> {enquiry.clientName}</div>
                <div><strong>Email:</strong> {enquiry.contactEmail || '—'}</div>
                <div><strong>Phone:</strong> {enquiry.contactPhone || '—'}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">New Enquiry</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                  <input required className="input-field" value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input required className="input-field" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" className="input-field" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input className="input-field" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea required rows={4} className="input-field" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Follow-up Date</label>
                <input type="date" className="input-field" value={formData.followUpDate} onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Submit Enquiry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Enquiries;
