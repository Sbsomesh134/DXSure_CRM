import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { 
  FiHome, FiUsers, FiFileText, FiCalendar, FiBookOpen,
  FiBriefcase, FiPhoneCall, FiTrendingUp, FiDollarSign, FiCreditCard
} from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: <FiHome /> },
    { name: 'Manage Users', path: '/admin/users', icon: <FiUsers /> },
    { name: 'Tickets', path: '/admin/tickets', icon: <FiFileText /> },
    { name: 'DayPlans', path: '/admin/dayplans', icon: <FiCalendar /> },
    { name: 'Activity Logs', path: '/admin/logs', icon: <FiBookOpen /> },
    { name: 'Day Book', path: '/admin/daybook', icon: <FiDollarSign /> },
  ];

  const employeeLinks = [
    { name: 'Dashboard', path: '/', icon: <FiHome /> },
    { name: 'DayPlan', path: '/dayplan', icon: <FiCalendar /> },
    { name: 'Enquiries', path: '/enquiries', icon: <FiPhoneCall /> },
    { name: 'Leads', path: '/leads', icon: <FiTrendingUp /> },
    { name: 'Clients', path: '/clients', icon: <FiBriefcase /> },
    { name: 'Tickets', path: '/tickets', icon: <FiFileText /> },
    { name: 'Vendors', path: '/vendors', icon: <FiUsers /> },
    { name: 'Pettycash', path: '/pettycash', icon: <FiDollarSign /> },
    { name: 'Payments', path: '/payments', icon: <FiCreditCard /> },
  ];

  const links = user?.role === 'Admin' ? adminLinks : employeeLinks;

  return (
    <aside className="w-64 bg-dark-bg text-slate-300 min-h-screen flex flex-col transition-all duration-300">
      <div className="h-16 flex items-center justify-center border-b border-dark-border">
        <h2 className="text-2xl font-bold text-white tracking-wider">DX<span className="text-primary-500">Sure</span></h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {links.map((link) => {
            const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                    : 'hover:bg-dark-border hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
