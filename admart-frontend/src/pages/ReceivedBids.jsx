import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProposalStore } from '../stores/proposalStore';
import { MessageSquare, DollarSign, Calendar, Check, X, Clock, User, LayoutGrid } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const ReceivedBids = () => {
  const navigate = useNavigate();
  const { receivedBids, fetchReceivedBids, acceptBid, rejectBid, isLoading } = useProposalStore();

  useEffect(() => {
    fetchReceivedBids();
  }, []);

  const handleAccept = async (bidId) => {
    if (window.confirm('Are you sure you want to accept this bid?')) {
      await acceptBid(bidId);
      fetchReceivedBids();
    }
  };

  const handleReject = async (bidId) => {
    if (window.confirm('Are you sure you want to reject this bid?')) {
      await rejectBid(bidId);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      ACCEPTED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const groupedBids = receivedBids.reduce((acc, bid) => {
    const proposalId = bid.proposal;
    if (!acc[proposalId]) {
      acc[proposalId] = [];
    }
    acc[proposalId].push(bid);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Received Bids</h1>
        <p className="text-gray-600 mt-2">Review bids from billboard owners on your proposals</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {!isLoading && receivedBids.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bids received yet</h3>
          <p className="text-gray-500 mb-4">Create a proposal to start receiving bids from billboard owners</p>
          <Link to="/create-proposal">
            <Button>Create Proposal</Button>
          </Link>
        </div>
      )}

      {!isLoading && receivedBids.length > 0 && (
        <div className="space-y-8">
          {Object.entries(groupedBids).map(([proposalId, bids]) => (
            <div key={proposalId}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Proposal #{proposalId}
                </h2>
                <span className="text-gray-500">{bids.length} bid{bids.length !== 1 ? 's' : ''}</span>
              </div>
              
              <div className="grid gap-4">
                {bids.map((bid) => (
                  <Card key={bid.id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User size={24} className="text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{bid.bidder?.username}</h3>
                            <p className="text-sm text-gray-500">
                              {bid.bidder?.first_name} {bid.bidder?.last_name}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                            {bid.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Billboard</p>
                            <p className="font-medium text-gray-900 flex items-center gap-1">
                              <LayoutGrid size={16} />
                              {bid.billboard?.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="font-medium text-gray-900 flex items-center gap-1">
                              <DollarSign size={16} />
                              ${bid.proposed_price}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-medium text-gray-900 flex items-center gap-1">
                              <Calendar size={16} />
                              {bid.proposed_start_date} - {bid.proposed_end_date}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Includes</p>
                            <p className="font-medium text-gray-900">
                              {bid.includes_design && 'Design '}
                              {bid.includes_installation && 'Installation'}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-1">Message</p>
                          <p className="text-gray-700">{bid.message}</p>
                        </div>
                      </div>

                      {bid.status === 'PENDING' && (
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => handleAccept(bid.id)}
                            className="w-full"
                          >
                            <Check size={18} className="mr-2" />
                            Accept Bid
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleReject(bid.id)}
                            className="w-full"
                          >
                            <X size={18} className="mr-2" />
                            Reject
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => navigate(`/bids/${bid.id}`)}
                            className="w-full"
                          >
                            <MessageSquare size={18} className="mr-2" />
                            Message
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedBids;
