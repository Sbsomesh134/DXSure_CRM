import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import useAuthStore from '../../store/authStore';

const DayBook = () => {
  const { user } = useAuthStore();
  const [dayBook, setDayBook] = useState({ payments: [], expenses: [], totals: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDayBook = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/daybook`, config);
        setDayBook(data);
      } catch (error) {
        toast.error('Failed to load day book data');
      } finally {
        setLoading(false);
      }
    };

    fetchDayBook();
  }, [user.token]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Day Book</h1>
        <p className="text-slate-500 mt-1">Overview of payments and expense activity.</p>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Total Paid</p>
          <p className="text-3xl font-bold text-slate-800 mt-3">${dayBook.totals.totalPaid?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Total Due</p>
          <p className="text-3xl font-bold text-slate-800 mt-3">${dayBook.totals.totalDue?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Total Expenses</p>
          <p className="text-3xl font-bold text-slate-800 mt-3">${dayBook.totals.totalExpenses?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Payments</h2>
          {loading ? (
            <p className="text-slate-500">Loading payments...</p>
          ) : dayBook.payments.length === 0 ? (
            <p className="text-slate-500">No payments found.</p>
          ) : (
            <div className="space-y-4">
              {dayBook.payments.map((payment) => (
                <div key={payment._id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-slate-800">{payment.invoiceNumber}</p>
                    <span className="text-sm text-slate-500">{payment.status}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">Client: {payment.client?.companyName || 'Unknown'}</p>
                  <p className="text-sm text-slate-600">Amount: ${payment.amount?.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Expenses</h2>
          {loading ? (
            <p className="text-slate-500">Loading expenses...</p>
          ) : dayBook.expenses.length === 0 ? (
            <p className="text-slate-500">No expenses found.</p>
          ) : (
            <div className="space-y-4">
              {dayBook.expenses.map((expense) => (
                <div key={expense._id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-slate-800">{expense.title}</p>
                    <span className="text-sm text-slate-500">{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">Category: {expense.category}</p>
                  <p className="text-sm text-slate-600">Amount: ${expense.amount?.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DayBook;
