import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/layout/Layout';
import useAuthStore from '../store/authStore';
import { FiPlus, FiMessageSquare } from 'react-icons/fi';

const Tickets = () => {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'Medium' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const endpoint = user.role === 'Admin' ? '/admin/tickets' : '/employee/tickets';
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, config);
      setTickets(data);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info('Ticket creation endpoint placeholder hit!');
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Ticketing System</h1>
          <p className="text-slate-500 mt-1">Manage client issues and internal support requests.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
          <FiPlus className="mr-2" /> Raise Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-slate-500">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-slate-500">No tickets found.</p>
        ) : (
          tickets.map(ticket => (
            <div key={ticket._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  ticket.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {ticket.priority} Priority
                </span>
                <span className="text-xs text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{ticket.title}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{ticket.description}</p>
              <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                <span className="text-sm font-medium text-slate-700">Status: {ticket.status}</span>
                <button className="text-primary-600 hover:text-primary-700"><FiMessageSquare size={18} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Raise New Ticket</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input required type="text" className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea required rows="3" className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select className="input-field" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Tickets;
