import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBillboardStore } from '../stores/billboardStore';
import { ArrowLeft, MapPin, DollarSign, Check } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const billboardSchema = z.object({
  name: z.string().min(5, 'Name must be at least 5 characters'),
  description: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().default('USA'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  billboard_type: z.string().min(1, 'Type is required'),
  width: z.string().min(1, 'Width is required'),
  height: z.string().min(1, 'Height is required'),
  illumination: z.boolean(),
  daily_rate: z.string().min(1, 'Daily rate is required'),
  weekly_rate: z.string().optional(),
  monthly_rate: z.string().optional(),
  status: z.string().default('AVAILABLE'),
});

const CreateBillboard = () => {
  const navigate = useNavigate();
  const { createBillboard, isLoading } = useBillboardStore();
  const [step, setStep] = useState(1);

  const { register, handleSubmit, formState: { errors }, trigger } = useForm({
    resolver: zodResolver(billboardSchema),
    defaultValues: {
      country: 'USA',
      billboard_type: 'TRADITIONAL',
      illumination: false,
      status: 'AVAILABLE',
    }
  });

  const onSubmit = async (data) => {
    try {
      const billboardData = {
        ...data,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        weekly_rate: data.weekly_rate || null,
        monthly_rate: data.monthly_rate || null,
      };
      await createBillboard(billboardData);
      navigate('/my-billboards');
    } catch (error) {
      console.error('Error creating billboard:', error);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1) {
      fieldsToValidate = ['name', 'billboard_type', 'width', 'height'];
    } else if (step === 2) {
      fieldsToValidate = ['address', 'city', 'state'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const billboardTypes = [
    { value: 'LED', label: 'LED Billboard' },
    { value: 'TRADITIONAL', label: 'Traditional Billboard' },
    { value: 'DIGITAL', label: 'Digital Billboard' },
    { value: 'VINYL', label: 'Vinyl Billboard' },
    { value: 'NEON', label: 'Neon Billboard' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/my-billboards')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={18} />
        Back to My Billboards
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Billboard</h1>
        <p className="text-gray-600 mt-2">List your billboard to receive bids from customers</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {['Basic Info', 'Location', 'Pricing'].map((label, index) => (
          <div key={index} className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${step > index + 1 ? 'bg-green-500 text-white' : 
                step === index + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}
            `}>
              {step > index + 1 ? <Check size={20} /> : index + 1}
            </div>
            <span className={`ml-2 hidden sm:inline ${step >= index + 1 ? 'text-gray-900' : 'text-gray-500'}`}>
              {label}
            </span>
            {index < 2 && (
              <div className={`w-12 sm:w-24 h-1 mx-2 ${step > index + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billboard Name *
              </label>
              <input
                {...register('name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Times Square LED Display"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe your billboard..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billboard Type *
              </label>
              <select
                {...register('billboard_type')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {billboardTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (feet) *
                </label>
                <input
                  {...register('width')}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 40"
                />
                {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (feet) *
                </label>
                <input
                  {...register('height')}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 20"
                />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                {...register('illumination')}
                type="checkbox"
                id="illumination"
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <label htmlFor="illumination" className="text-sm text-gray-700">
                Has illumination/lighting
              </label>
            </div>
          </Card>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <MapPin size={20} className="inline mr-2" />
              Location Details
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                {...register('address')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="123 Main Street"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  {...register('city')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="New York"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  {...register('state')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="NY"
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                {...register('country')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="USA"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  {...register('latitude')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="40.7580"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  {...register('longitude')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="-73.9855"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Pricing */}
        {step === 3 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <DollarSign size={20} className="inline mr-2" />
              Pricing
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Rate ($) *
              </label>
              <input
                {...register('daily_rate')}
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 500"
              />
              {errors.daily_rate && <p className="text-red-500 text-sm mt-1">{errors.daily_rate.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weekly Rate ($)
                </label>
                <input
                  {...register('weekly_rate')}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 3000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rate ($)
                </label>
                <input
                  {...register('monthly_rate')}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 10000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="AVAILABLE">Available</option>
                <option value="BOOKED">Booked</option>
                <option value="MAINTENANCE">Under Maintenance</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={18} className="mr-2" />
              Previous
            </Button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit" loading={isLoading}>
              Create Billboard
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateBillboard;
