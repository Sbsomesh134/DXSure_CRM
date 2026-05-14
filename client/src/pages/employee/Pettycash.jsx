import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import useAuthStore from '../../store/authStore';
import { FiPlus, FiDollarSign } from 'react-icons/fi';

const Pettycash = () => {
  const { user } = useAuthStore();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Office' });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Placeholder for expenses endpoint
      // const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/employee/expenses`, config);
      // setExpenses(data);
      setExpenses([]); // Dummy until endpoint is fully made
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info('Expense submission endpoint will be connected here.');
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pettycash</h1>
          <p className="text-slate-500 mt-1">Submit and track your company expenses.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
          <FiPlus className="mr-2" /> Add Expense
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Title</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <FiDollarSign className="mx-auto text-4xl text-slate-300 mb-3" />
                    <p>No expenses recorded yet.</p>
                  </td>
                </tr>
              ) : (
                expenses.map(exp => (
                  <tr key={exp._id}>
                    <td className="px-6 py-4">{exp.date}</td>
                    <td className="px-6 py-4">{exp.title}</td>
                    <td className="px-6 py-4">{exp.category}</td>
                    <td className="px-6 py-4">${exp.amount}</td>
                    <td className="px-6 py-4">{exp.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Record Expense</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input required type="text" className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                <input required type="number" className="input-field" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Office">Office</option>
                  <option value="Travel">Travel</option>
                  <option value="Meals">Meals</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Pettycash;
