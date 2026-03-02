import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBidStore } from '../stores/bidStore';
import { FileText, DollarSign, Calendar, Clock, CheckCircle, XCircle, MessageSquare, Plus } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const MyBids = () => {
  const { myBids, fetchMyBids, withdrawBid, isLoading } = useBidStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyBids();
  }, []);

  const handleWithdraw = async (bidId) => {
    if (window.confirm('Are you sure you want to withdraw this bid?')) {
      await withdrawBid(bidId);
      fetchMyBids();
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      ACCEPTED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      WITHDRAWN: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredBids = myBids.filter(bid => {
    if (filter === 'all') return true;
    return bid.status === filter;
  });

  const stats = {
    total: myBids.length,
    pending: myBids.filter(b => b.status === 'PENDING').length,
    accepted: myBids.filter(b => b.status === 'ACCEPTED').length,
    rejected: myBids.filter(b => b.status === 'REJECTED').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bids</h1>
        <p className="text-gray-600 mt-2">Track your bids on customer proposals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Bids</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
          <p className="text-sm text-gray-500">Accepted</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-sm text-gray-500">Rejected</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${filter === status 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Bids List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredBids.map((bid) => (
            <Card key={bid.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                      {bid.status === 'PENDING' && <Clock size={14} className="inline mr-1" />}
                      {bid.status === 'ACCEPTED' && <CheckCircle size={14} className="inline mr-1" />}
                      {bid.status === 'REJECTED' && <XCircle size={14} className="inline mr-1" />}
                      {bid.status}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Bid #{bid.id}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Proposal #{bid.proposal}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Your Price</p>
                      <p className="font-semibold text-indigo-600 flex items-center gap-1">
                        <DollarSign size={16} />
                        ${bid.proposed_price}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar size={16} />
                        {bid.proposed_start_date} - {bid.proposed_end_date}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Includes</p>
                      <p className="font-medium">
                        {bid.includes_design && 'Design '}
                        {bid.includes_installation && 'Installation'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Billboard</p>
                      <p className="font-medium">
                        {bid.billboard?.name || 'Billboard #' + bid.billboard}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-1">Your Message</p>
                    <p className="text-gray-700">{bid.message}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {bid.status === 'PENDING' && (
                    <Button
                      variant="outline"
                      onClick={() => handleWithdraw(bid.id)}
                      className="w-full"
                    >
                      Withdraw Bid
                    </Button>
                  )}
                  <Link to="/proposals" className="w-full">
                    <Button variant="secondary" className="w-full">
                      <Plus size={16} className="mr-1" />
                      New Bid
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredBids.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bids yet</h3>
          <p className="text-gray-500 mb-4">Browse proposals and submit your first bid</p>
          <Link to="/proposals">
            <Button>Browse Proposals</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBids;
