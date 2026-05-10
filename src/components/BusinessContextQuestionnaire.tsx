import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  companyDescription: string;
  industryNiche: string;
  businessHistory: string;
  revenueRange: string;
  idealCustomer: string;
  mainProblem: string;
  customerTransformation: string;
  referralLanguage: string;
  coreOffers: string;
  differentiation: string;
  customerAcquisition: string;
  salesProcess: string;
}

const BusinessContextQuestionnaire: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    // Handle form submission here (e.g., send to API)
    alert('Questionnaire submitted successfully!');
  };

  const steps = [
    {
      title: "WHO YOU ARE (The Baseline)",
      fields: [
        {
          name: "companyDescription",
          label: "What does your company do in one sentence?",
          type: "text",
          required: true,
          placeholder: "e.g., We help SaaS companies scale their customer acquisition through data-driven marketing strategies."
        },
        {
          name: "industryNiche",
          label: "What industry or niche are you in? Specifically: who do you serve and who do you avoid?",
          type: "textarea",
          required: true,
          placeholder: "Describe your target market and any segments you intentionally exclude..."
        },
        {
          name: "businessHistory",
          label: "How long have you been in business? Include your professional background and relevant track record.",
          type: "textarea",
          required: true,
          placeholder: "Share your business timeline and professional experience..."
        },
        {
          name: "revenueRange",
          label: "What is your approximate annual revenue range? Include portfolio aggregate or personal brand revenue if applicable.",
          type: "text",
          required: true,
          placeholder: "e.g., $500K-$2M, or $10M+ across portfolio companies"
        }
      ]
    },
    {
      title: "YOUR CUSTOMER (The Avatar)",
      fields: [
        {
          name: "idealCustomer",
          label: "Who is your ideal customer? Describe them in detail (Age, role, revenue, family status, habits, mindset).",
          type: "textarea",
          required: true,
          placeholder: "Paint a detailed picture of your perfect customer..."
        },
        {
          name: "mainProblem",
          label: "What is the #1 problem you solve for them? What is the specific bottleneck killing their growth?",
          type: "textarea",
          required: true,
          placeholder: "Identify the core pain point and growth blocker..."
        },
        {
          name: "customerTransformation",
          label: "What transformation do your customers experience? Describe the \"Before\" vs. the \"After\" (Revenue, time, stress levels).",
          type: "textarea",
          required: true,
          placeholder: "Describe the journey from problem to solution..."
        },
        {
          name: "referralLanguage",
          label: "What do customers say when they refer you? What specific words or internal vocabulary do they use?",
          type: "textarea",
          required: true,
          placeholder: "Capture the exact language and phrases your customers use..."
        }
      ]
    },
    {
      title: "YOUR OFFER & MODEL",
      fields: [
        {
          name: "coreOffers",
          label: "What do you sell? Describe your core offer(s). Include free, mid-tier, and high-ticket/equity partnership levels.",
          type: "textarea",
          required: true,
          placeholder: "Detail your product/service tiers and pricing structure..."
        },
        {
          name: "differentiation",
          label: "What makes your offer different from competitors? Focus on your receipts, aligned incentives, or volume of free value.",
          type: "textarea",
          required: true,
          placeholder: "Explain what sets you apart and proves your value..."
        },
        {
          name: "customerAcquisition",
          label: "What is your primary way of getting customers right now?",
          type: "select",
          required: true,
          options: ["Content", "Outbound", "Referrals", "Paid Ads"]
        },
        {
          name: "salesProcess",
          label: "What does your sales process look like? Step-by-step from initial contact to closing.",
          type: "textarea",
          required: true,
          placeholder: "Map out your complete sales funnel..."
        }
      ]
    }
  ];

  const renderField = (field: any) => {
    const fieldProps = {
      ...register(field.name as keyof FormData, { required: field.required }),
      className: `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
        errors[field.name as keyof FormData] ? 'border-red-500' : ''
      }`,
      placeholder: field.placeholder
    };

    if (field.type === 'textarea') {
      return <textarea {...fieldProps} rows={4} />;
    } else if (field.type === 'select') {
      return (
        <select {...fieldProps}>
          <option value="">Select an option...</option>
          {field.options.map((option: string) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    } else {
      return <input {...fieldProps} type={field.type} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Context Questionnaire</h1>
        <p className="text-lg text-gray-700 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          Please fill this out with as much specificity as possible. Use real numbers, specific names of frameworks, and the actual language your customers use.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep > index + 1 ? 'bg-green-500 text-white' :
                currentStep === index + 1 ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-gray-600">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {steps[currentStep - 1].fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {errors[field.name as keyof FormData] && (
                <p className="mt-1 text-sm text-red-600">This field is required</p>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Submit Questionnaire
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BusinessContextQuestionnaire;