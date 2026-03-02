import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProposalStore } from '../stores/proposalStore';
import { FileText, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const proposalSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  campaign_name: z.string().min(2, 'Campaign name is required'),
  ad_type: z.string().min(1, 'Ad type is required'),
  ad_content: z.string().min(10, 'Ad content is required'),
  preferred_location: z.string().optional(),
  preferred_billboard_type: z.string().optional(),
  min_width: z.string().optional(),
  min_height: z.string().optional(),
  requires_illumination: z.boolean().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  budget_min: z.string().min(1, 'Minimum budget is required'),
  budget_max: z.string().min(1, 'Maximum budget is required'),
});

const CreateProposal = () => {
  const navigate = useNavigate();
  const { createProposal, isLoading } = useProposalStore();
  const [step, setStep] = useState(1);

  const { register, handleSubmit, formState: { errors }, trigger } = useForm({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      ad_type: 'BRAND',
      preferred_billboard_type: 'ANY',
      requires_illumination: false,
    }
  });

  const onSubmit = async (data) => {
    try {
      const proposalData = {
        ...data,
        min_width: data.min_width || null,
        min_height: data.min_height || null,
      };
      const result = await createProposal(proposalData);
      navigate('/proposals');
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  };

  const adTypes = [
    { value: 'PRODUCT', label: 'Product Launch' },
    { value: 'BRAND', label: 'Brand Awareness' },
    { value: 'EVENT', label: 'Event Promotion' },
    { value: 'SERVICE', label: 'Service Promotion' },
    { value: 'SEASONAL', label: 'Seasonal Campaign' },
    { value: 'OTHER', label: 'Other' },
  ];

  const billboardTypes = [
    { value: 'ANY', label: 'Any Type' },
    { value: 'LED', label: 'LED Billboard' },
    { value: 'TRADITIONAL', label: 'Traditional Billboard' },
    { value: 'DIGITAL', label: 'Digital Billboard' },
  ];

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1) {
      fieldsToValidate = ['title', 'description', 'campaign_name', 'ad_type', 'ad_content'];
    } else if (step === 2) {
      fieldsToValidate = ['start_date', 'end_date', 'budget_min', 'budget_max'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/proposals')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Proposals
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Proposal</h1>
        <p className="text-gray-600 mt-2">Tell us about your advertising campaign</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {['Campaign Info', 'Requirements', 'Budget'].map((label, index) => (
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
        {/* Step 1: Campaign Info */}
        {step === 1 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proposal Title *
              </label>
              <input
                {...register('title')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Summer Sale Campaign 2026"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name *
              </label>
              <input
                {...register('campaign_name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Summer Sale"
              />
              {errors.campaign_name && <p className="text-red-500 text-sm mt-1">{errors.campaign_name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Type *
              </label>
              <select
                {...register('ad_type')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {adTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Content/Message *
              </label>
              <textarea
                {...register('ad_content')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter the message you want to display on the billboard..."
              />
              {errors.ad_content && <p className="text-red-500 text-sm mt-1">{errors.ad_content.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe your campaign in detail..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
          </Card>
        )}

        {/* Step 2: Requirements */}
        {step === 2 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Billboard Requirements</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Location
              </label>
              <input
                {...register('preferred_location')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Downtown NYC, Los Angeles..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Billboard Type
              </label>
              <select
                {...register('preferred_billboard_type')}
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
                  Minimum Width (feet)
                </label>
                <input
                  {...register('min_width')}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Height (feet)
                </label>
                <input
                  {...register('min_height')}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 15"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                {...register('requires_illumination')}
                type="checkbox"
                id="illumination"
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <label htmlFor="illumination" className="text-sm text-gray-700">
                Requires illumination/lighting
              </label>
            </div>
          </Card>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Duration & Budget</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  {...register('start_date')}
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  {...register('end_date')}
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Budget ($) *
                </label>
                <input
                  {...register('budget_min')}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 5000"
                />
                {errors.budget_min && <p className="text-red-500 text-sm mt-1">{errors.budget_min.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Budget ($) *
                </label>
                <input
                  {...register('budget_max')}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 15000"
                />
                {errors.budget_max && <p className="text-red-500 text-sm mt-1">{errors.budget_max.message}</p>}
              </div>
            </div>
          </Card>
        )}

        {/* Navigation Buttons */}
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
            <Button type="button" onClick={() => setStep(step + 1)}>
              Next
              <ArrowRight size={18} className="ml-2" />
            </Button>
          ) : (
            <Button type="submit" loading={isLoading}>
              Create Proposal
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateProposal;
