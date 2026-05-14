import { create } from 'zustand';
import Cookies from 'js-cookie';

const useAuthStore = create((set) => ({
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,
  isAuthenticated: !!Cookies.get('user'),
  
  login: (userData) => {
    Cookies.set('user', JSON.stringify(userData), { expires: 30 }); // 30 days
    set({ user: userData, isAuthenticated: true });
  },
  
  logout: () => {
    Cookies.remove('user');
    set({ user: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
