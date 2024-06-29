import Sidebar from '../components/dashboard/Sidebar';
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="flex flex-col bg-[#130B30] min-h-screen">
      <div className="flex">
        <div>
          <Sidebar />
        </div>
        <div className="flex flex-col flex-grow p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}