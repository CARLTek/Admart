import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBillboardStore } from '../stores/billboardStore';
import { MapPin, DollarSign, Clock, CheckCircle, Image } from 'lucide-react';
import Card from '../components/common/Card';

const Billboards = () => {
  const { billboards, fetchBillboards, isLoading } = useBillboardStore();
  const [filters, setFilters] = useState({
    city: '',
    billboard_type: '',
    status: ''
  });

  useEffect(() => {
    fetchBillboards();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    fetchBillboards({ [name]: value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Billboards</h1>
        <p className="text-gray-600 mt-2">Find the perfect billboard for your advertising campaign</p>
      </div>

      {/* Filters */}
      <Card className="mb-8 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Search by city..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              name="billboard_type"
              value={filters.billboard_type}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="LED">LED Billboard</option>
              <option value="TRADITIONAL">Traditional</option>
              <option value="DIGITAL">Digital</option>
              <option value="VINYL">Vinyl</option>
              <option value="NEON">Neon</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="BOOKED">Booked</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ city: '', billboard_type: '', status: '' });
                fetchBillboards();
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Billboards Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {billboards.map((billboard) => (
            <Link key={billboard.id} to={`/billboards/${billboard.id}`}>
              <Card hover className="h-full">
                {/* Image */}
                <div className="h-48 bg-gray-200 rounded-t-xl relative overflow-hidden">
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
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${billboard.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                    `}>
                      {billboard.status}
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
                    <MapPin size={16} />
                    <span>{billboard.city}, {billboard.state}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">
                        {billboard.width}' x {billboard.height}'
                      </span>
                      {billboard.illumination && (
                        <span className="text-yellow-600">💡</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-indigo-600 font-semibold">
                      <DollarSign size={16} />
                      <span>${billboard.daily_rate}/day</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && billboards.length === 0 && (
        <div className="text-center py-12">
          <LayoutGrid size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No billboards found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later</p>
        </div>
      )}
    </div>
  );
};

export default Billboards;
