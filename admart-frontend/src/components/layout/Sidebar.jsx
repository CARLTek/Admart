import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  LayoutDashboard,
  LayoutGrid,
  FileText,
  Plus,
  MessageSquare,
  Settings,
  User,
  LogOut,
  X,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const isCustomer = user?.user_type === 'CUSTOMER';
  const isBillboardOwner = user?.user_type === 'BILLBOARD_OWNER';

  const customerLinks = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/billboards', icon: LayoutGrid, label: 'Browse Billboards' },
    { path: '/proposals', icon: FileText, label: 'My Proposals' },
    { path: '/create-proposal', icon: Plus, label: 'Create Proposal' },
    { path: '/received-bids', icon: MessageSquare, label: 'Received Bids' },
  ];

  const ownerLinks = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/my-billboards', icon: LayoutGrid, label: 'My Billboards' },
    { path: '/create-billboard', icon: Plus, label: 'Add Billboard' },
    { path: '/my-bids', icon: FileText, label: 'My Bids' },
  ];

  const links = isCustomer ? customerLinks : ownerLinks;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AdMart</span>
            </Link>
            <button onClick={onClose} className="lg:hidden p-2 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user?.username}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                {isCustomer ? 'Customer' : 'Billboard Owner'}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-indigo-50 text-indigo-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <link.icon size={20} />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Stats */}
          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <CheckCircle size={20} className="mx-auto text-green-600 mb-1" />
                <p className="text-lg font-bold text-green-700">2</p>
                <p className="text-xs text-green-600">Active</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <Clock size={20} className="mx-auto text-yellow-600 mb-1" />
                <p className="text-lg font-bold text-yellow-700">1</p>
                <p className="text-xs text-yellow-600">Pending</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
