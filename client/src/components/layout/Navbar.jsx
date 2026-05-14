import { FiMenu, FiBell, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 mr-4 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
        >
          <FiMenu size={20} />
        </button>
        <h2 className="text-xl font-semibold text-slate-800 hidden sm:block">
          {user?.role === 'Admin' ? 'Admin Portal' : 'Employee Portal'}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
          <FiBell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-700">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
            <FiChevronDown className="text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
              <div className="px-4 py-2 border-b border-slate-100 md:hidden">
                <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
              >
                <FiLogOut className="mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
