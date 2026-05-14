import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import useAuthStore from '../../store/authStore';

const Vendors = () => {
  const { user } = useAuthStore();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', contactPerson: '', email: '', phone: '', category: '', address: '' });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/employee/vendors`, config);
      setVendors(data);
    } catch (error) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/employee/vendors`, formData, config);
      toast.success('Vendor added successfully');
      setShowModal(false);
      setFormData({ name: '', contactPerson: '', email: '', phone: '', category: '', address: '' });
      fetchVendors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add vendor');
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Vendors</h1>
          <p className="text-slate-500 mt-1">Manage vendor contacts and supplier information.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          Add Vendor
        </button>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <p className="text-slate-500">Loading vendors...</p>
        ) : vendors.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-100 text-center">
            <p className="text-slate-600">No vendors have been added yet.</p>
          </div>
        ) : (
          vendors.map((vendor) => (
            <div key={vendor._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">{vendor.name}</h2>
                  <p className="text-slate-500 text-sm">{vendor.category}</p>
                </div>
                <span className="text-sm text-slate-500">{new Date(vendor.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="grid gap-2 text-sm text-slate-600">
                <div><span className="font-medium text-slate-700">Contact:</span> {vendor.contactPerson || '—'}</div>
                <div><span className="font-medium text-slate-700">Email:</span> {vendor.email}</div>
                <div><span className="font-medium text-slate-700">Phone:</span> {vendor.phone}</div>
                <div><span className="font-medium text-slate-700">Address:</span> {vendor.address || '—'}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">New Vendor</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Name</label>
                  <input required className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                  <input className="input-field" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input required type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input required className="input-field" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input required className="input-field" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input className="input-field" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Vendors;
