import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProposalStore } from '../stores/proposalStore';
import { useBidStore } from '../stores/bidStore';
import { useBillboardStore } from '../stores/billboardStore';
import Sidebar from '../components/layout/Sidebar';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  LayoutGrid,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  Menu
} from 'lucide-react';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { myProposals, fetchMyProposals, receivedBids, fetchReceivedBids } = useProposalStore();
  const { myBids, fetchMyBids } = useBidStore();
  const { myBillboards, fetchMyBillboards } = useBillboardStore();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (user?.user_type === 'CUSTOMER') {
          await Promise.all([fetchMyProposals(), fetchReceivedBids()]);
        } else if (user?.user_type === 'BILLBOARD_OWNER') {
          await Promise.all([fetchMyBillboards(), fetchMyBids()]);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.user_type]);

  const isCustomer = user?.user_type === 'CUSTOMER';
  const isBillboardOwner = user?.user_type === 'BILLBOARD_OWNER';

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-700',
      OPEN: 'bg-blue-100 text-blue-700',
      IN_REVIEW: 'bg-yellow-100 text-yellow-700',
      ACCEPTED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      CANCELLED: 'bg-gray-100 text-gray-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      WITHDRAWN: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar isOpen={true} onClose={() => {}} />
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-semibold">Dashboard</span>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.first_name || user?.username}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your account today.
            </p>
          </div>

          {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isCustomer && (
          <>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <FileText className="text-indigo-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Proposals</p>
                  <p className="text-2xl font-bold text-gray-900">{myProposals.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MessageSquare className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Received Bids</p>
                  <p className="text-2xl font-bold text-gray-900">{receivedBids.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myProposals.filter(p => p.status === 'ACCEPTED').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Open</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myProposals.filter(p => p.status === 'OPEN').length}
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}

        {isBillboardOwner && (
          <>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <LayoutGrid className="text-indigo-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">My Billboards</p>
                  <p className="text-2xl font-bold text-gray-900">{myBillboards.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Bids</p>
                  <p className="text-2xl font-bold text-gray-900">{myBids.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Accepted Bids</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myBids.filter(b => b.status === 'ACCEPTED').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myBids.filter(b => b.status === 'PENDING').length}
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          {isCustomer && (
            <Link to="/create-proposal">
              <Button>
                <Plus size={18} className="mr-2" />
                Create Proposal
              </Button>
            </Link>
          )}
          {isBillboardOwner && (
            <Link to="/create-billboard">
              <Button>
                <Plus size={18} className="mr-2" />
                Add Billboard
              </Button>
            </Link>
          )}
          <Link to={isCustomer ? "/proposals" : "/billboards"}>
            <Button variant="outline">
              {isCustomer ? "Browse Proposals" : "Browse Billboards"}
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Proposals / Bids */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {isCustomer ? 'Recent Proposals' : 'Recent Bids'}
            </h3>
            <Link 
              to={isCustomer ? "/proposals" : "/my-bids"} 
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              View All
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            {(isCustomer ? myProposals : myBids).slice(0, 5).map((item) => (
              <Link
                key={item.id}
                to={isCustomer ? `/proposals/${item.id}` : `/bids/${item.id}`}
                className="block px-6 py-4 hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {isCustomer ? item.title : `Bid #${item.id} - $${item.proposed_price}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {isCustomer 
                        ? `${item.campaign_name} • ${item.bid_count} bids` 
                        : `Proposal: ${item.proposal?.title || item.proposal}`
                      }
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </Link>
            ))}
            {(isCustomer ? myProposals : myBids).length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No {isCustomer ? 'proposals' : 'bids'} yet
              </div>
            )}
          </CardBody>
        </Card>

        {/* Received Bids / My Billboards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {isCustomer ? 'Received Bids' : 'My Billboards'}
            </h3>
            <Link 
              to={isCustomer ? "/received-bids" : "/my-billboards"} 
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              View All
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            {(isCustomer ? receivedBids : myBillboards).slice(0, 5).map((item) => (
              <Link
                key={item.id}
                to={isCustomer ? `/bids/${item.id}` : `/billboards/${item.id}`}
                className="block px-6 py-4 hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {isCustomer 
                        ? `$${item.proposed_price} - ${item.billboard?.name}` 
                        : item.name
                      }
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {isCustomer 
                        ? `By ${item.bidder?.username}` 
                        : `${item.city}, ${item.state}`
                      }
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </Link>
            ))}
            {(isCustomer ? receivedBids : myBillboards).length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No {isCustomer ? 'bids received' : 'billboards yet'}
              </div>
            )}
          </CardBody>
        </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
