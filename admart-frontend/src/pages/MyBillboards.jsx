import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBillboardStore } from '../stores/billboardStore';
import { MapPin, DollarSign, Image, Edit, Trash2, Plus, Eye } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const MyBillboards = () => {
  const { myBillboards, fetchMyBillboards, deleteBillboard, isLoading } = useBillboardStore();
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  useEffect(() => {
    fetchMyBillboards();
  }, []);

  const handleDelete = async () => {
    if (deleteModal.id) {
      await deleteBillboard(deleteModal.id);
      setDeleteModal({ open: false, id: null });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      AVAILABLE: 'bg-green-100 text-green-700',
      BOOKED: 'bg-blue-100 text-blue-700',
      MAINTENANCE: 'bg-yellow-100 text-yellow-700',
      UNAVAILABLE: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Billboards</h1>
          <p className="text-gray-600 mt-2">Manage your billboard listings</p>
        </div>
        <Link to="/create-billboard" className="mt-4 md:mt-0">
          <Button>
            <Plus size={18} className="mr-2" />
            Add Billboard
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Billboards Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBillboards.map((billboard) => (
            <Card key={billboard.id} className="overflow-hidden">
              {/* Image */}
              <div className="h-48 bg-gray-200 relative">
                {billboard.primary_image ? (
                  <img 
                    src={billboard.primary_image} 
                    alt={billboard.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={48} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(billboard.status)}`}>
                    {billboard.status}
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    billboard.is_verified === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                    billboard.is_verified === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {billboard.is_verified}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{billboard.name}</h3>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                    {billboard.billboard_type}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                  <MapPin size={14} />
                  <span>{billboard.city}, {billboard.state}</span>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-gray-500">
                    {billboard.width}' x {billboard.height}'
                  </span>
                  <span className="text-indigo-600 font-semibold">
                    ${billboard.daily_rate}/day
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link to={`/billboards/${billboard.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Eye size={16} className="mr-1" />
                      View
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex-1">
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => setDeleteModal({ open: true, id: billboard.id })}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && myBillboards.length === 0 && (
        <div className="text-center py-12">
          <Image size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No billboards yet</h3>
          <p className="text-gray-500 mb-4">Add your first billboard to start receiving bids</p>
          <Link to="/create-billboard">
            <Button>
              <Plus size={18} className="mr-2" />
              Add Billboard
            </Button>
          </Link>
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Delete Billboard"
        size="sm"
      >
        <p className="text-gray-600 mb-6">Are you sure you want to delete this billboard? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setDeleteModal({ open: false, id: null })} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1">
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyBillboards;
