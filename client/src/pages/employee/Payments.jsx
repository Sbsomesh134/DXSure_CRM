import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import useAuthStore from '../../store/authStore';

const Payments = () => {
  const { user } = useAuthStore();
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    client: '', invoiceNumber: '', amount: '', status: 'Pending', dueDate: '', paymentDate: '', paymentMethod: 'Bank Transfer'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [paymentsRes, clientsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/employee/payments`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/employee/clients`, config)
      ]);
      setPayments(paymentsRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      toast.error('Failed to load payments or clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/employee/payments`, formData, config);
      toast.success('Payment record saved');
      setShowModal(false);
      setFormData({ client: '', invoiceNumber: '', amount: '', status: 'Pending', dueDate: '', paymentDate: '', paymentMethod: 'Bank Transfer' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Payments</h1>
          <p className="text-slate-500 mt-1">View payment history and record new invoices.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          Record Payment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 overflow-x-auto">
        {loading ? (
          <p className="text-slate-500">Loading payments...</p>
        ) : payments.length === 0 ? (
          <p className="text-slate-500">No payment records found.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 font-medium text-slate-600">Client</th>
                <th className="py-3 font-medium text-slate-600">Invoice</th>
                <th className="py-3 font-medium text-slate-600">Amount</th>
                <th className="py-3 font-medium text-slate-600">Status</th>
                <th className="py-3 font-medium text-slate-600">Due Date</th>
                <th className="py-3 font-medium text-slate-600">Method</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b border-slate-200 last:border-none hover:bg-slate-50">
                  <td className="py-4 text-slate-700">{payment.client?.companyName || 'Unknown'}</td>
                  <td className="py-4 text-slate-700">{payment.invoiceNumber}</td>
                  <td className="py-4 text-slate-700">${payment.amount?.toFixed(2)}</td>
                  <td className="py-4 text-slate-700">{payment.status}</td>
                  <td className="py-4 text-slate-700">{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : '—'}</td>
                  <td className="py-4 text-slate-700">{payment.paymentMethod || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Record New Payment</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                  <select required className="input-field" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })}>
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>{client.companyName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Number</label>
                  <input required className="input-field" value={formData.invoiceNumber} onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                  <input required type="number" step="0.01" className="input-field" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select required className="input-field" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                  <select className="input-field" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input required type="date" className="input-field" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Payment Date</label>
                  <input type="date" className="input-field" value={formData.paymentDate} onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Payments;
