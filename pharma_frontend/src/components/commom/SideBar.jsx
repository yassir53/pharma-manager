import {  LocalPharmacy, Receipt, Logout } from '@mui/icons-material';
import  {logout}  from '../../api/auth.js';

const SideBar = () => {
      const HandleVenteClick = () => {
        if(localStorage.getItem('access_token') || localStorage.getItem('refresh_token')) {
          window.location.href = '/vente';
        } else {
          window.location.href = '/';
        }
      };
      const HandleMédicamentClick = () => {
        if(localStorage.getItem('access_token') || localStorage.getItem('refresh_token')) {
          window.location.href = '/médicament';
        } else {
          window.location.href = '/';
        }
      };
      const HandleDashboardClick = () => {
        if(localStorage.getItem('access_token') || localStorage.getItem('refresh_token')) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/';
        }
      }
      const HandleLogoutClick = () => {
        logout();
      }

    return (
        <aside className="w-64 bg-blue-700 text-white flex flex-col fixed h-full">
        <div className="p-6 flex items-center gap-3 border-b border-blue-600">
          <LocalPharmacy />
          <span className="font-bold text-xl tracking-tight">PHARMA MANAGER</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button className="flex items-center gap-4 w-full p-3 bg-emerald-500 rounded-lg font-medium"
          onClick={HandleDashboardClick}>
             Dashboard
          </button>
          <button className="flex items-center gap-4 w-full p-3 hover:bg-blue-600 rounded-lg transition-colors"
          onClick={HandleMédicamentClick}>
             Médicament
          </button>
          <button className="flex items-center gap-4 w-full p-3 hover:bg-blue-600 rounded-lg transition-colors"
          onClick={HandleVenteClick}>
             Vente
          </button>
        </nav>

        <div className="p-4 border-t border-blue-600">
          <button className="flex items-center gap-4 w-full p-3 hover:bg-red-500 rounded-lg transition-colors"
          onClick={HandleLogoutClick}>
            <Logout /> Déconnexion
          </button>
        </div>
      </aside>
    );
};

export default SideBar;