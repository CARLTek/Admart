import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProposalStore } from '../stores/proposalStore';
import { FileText, Plus, Calendar, DollarSign, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Proposals = () => {
  const { myProposals, fetchMyProposals, isLoading } = useProposalStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyProposals();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-700',
      OPEN: 'bg-blue-100 text-blue-700',
      IN_REVIEW: 'bg-yellow-100 text-yellow-700',
      ACCEPTED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      CANCELLED: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACCEPTED': return <CheckCircle size={16} className="text-green-600" />;
      case 'REJECTED': return <XCircle size={16} className="text-red-600" />;
      case 'OPEN': return <Clock size={16} className="text-blue-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const filteredProposals = myProposals.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Proposals</h1>
          <p className="text-gray-600 mt-2">Manage your advertising campaign proposals</p>
        </div>
        <Link to="/create-proposal" className="mt-4 md:mt-0">
          <Button>
            <Plus size={18} className="mr-2" />
            Create Proposal
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'DRAFT', 'OPEN', 'IN_REVIEW', 'ACCEPTED', 'REJECTED'].map((status) => (
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
            {status === 'all' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Proposals List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <Link key={proposal.id} to={`/proposals/${proposal.id}`}>
              <Card hover className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{proposal.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                        {getStatusIcon(proposal.status)}
                        <span className="ml-1">{proposal.status}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{proposal.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{proposal.start_date} - {proposal.end_date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={16} />
                        <span>${proposal.budget_min} - ${proposal.budget_max}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={16} />
                        <span>{proposal.bid_count} bids</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded">
                      {proposal.ad_type}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProposals.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals yet</h3>
          <p className="text-gray-500 mb-4">Create your first proposal to get started</p>
          <Link to="/create-proposal">
            <Button>
              <Plus size={18} className="mr-2" />
              Create Proposal
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Proposals;
