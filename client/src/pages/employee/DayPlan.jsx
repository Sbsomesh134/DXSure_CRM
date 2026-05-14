import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import useAuthStore from '../../store/authStore';

const DayPlan = () => {
  const { user } = useAuthStore();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [tasks, setTasks] = useState(['']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/employee/dayplan`, config);
        setDate(data.date ? data.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
        const loadedTasks = Array.isArray(data.tasks)
          ? data.tasks.map((task) => (typeof task === 'string' ? task : task.title || ''))
          : [];
        setTasks(loadedTasks.length > 0 ? loadedTasks : ['']);
      } catch (error) {
        toast.error('Unable to load your day plan');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [user.token]);

  const handleTaskChange = (index, value) => {
    const updated = [...tasks];
    updated[index] = value;
    setTasks(updated);
  };

  const addTask = () => setTasks((prev) => [...prev, '']);
  const removeTask = (index) => setTasks((prev) => prev.filter((_, idx) => idx !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const filteredTasks = tasks.filter((task) => task.trim() !== '');
      await axios.post(`${import.meta.env.VITE_API_URL}/employee/dayplan`, { date, tasks: filteredTasks }, config);
      toast.success('Day plan saved successfully');
    } catch (error) {
      toast.error('Failed to save day plan');
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Daily Plan</h1>
          <p className="text-slate-500 mt-1">Submit and review tasks for today.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Plan Date</label>
            <input
              type="date"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-800">Tasks</h2>
              <button type="button" onClick={addTask} className="btn-secondary text-sm">
                Add Task
              </button>
            </div>

            {loading ? (
              <p className="text-slate-500">Loading tasks...</p>
            ) : (
              tasks.map((task, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <textarea
                    className="input-field flex-1 resize-none"
                    rows={2}
                    value={task}
                    placeholder={`Task ${index + 1}`}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                  />
                  {tasks.length > 1 && (
                    <button type="button" onClick={() => removeTask(index)} className="btn-secondary px-3 py-2">
                      Remove
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary">
              Save DayPlan
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default DayPlan;
