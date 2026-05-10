'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
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

interface Question {
  name: keyof FormData;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  placeholder: string;
  options?: string[];
  step: number;
  stepTitle: string;
}

const questions: Question[] = [
  {
    name: 'companyDescription',
    label: 'What does your company do in one sentence?',
    type: 'text',
    required: true,
    placeholder: 'e.g., We help SaaS companies scale their customer acquisition through data-driven marketing strategies.',
    step: 1,
    stepTitle: 'WHO YOU ARE',
  },
  {
    name: 'industryNiche',
    label: 'What industry or niche are you in? Specifically: who do you serve and who do you avoid?',
    type: 'textarea',
    required: true,
    placeholder: 'Describe your target market and any segments you intentionally exclude...',
    step: 1,
    stepTitle: 'WHO YOU ARE',
  },
  {
    name: 'businessHistory',
    label: 'How long have you been in business? Include your professional background and relevant track record.',
    type: 'textarea',
    required: true,
    placeholder: 'Share your business timeline and professional experience...',
    step: 1,
    stepTitle: 'WHO YOU ARE',
  },
  {
    name: 'revenueRange',
    label: 'What is your approximate annual revenue range? Include portfolio aggregate or personal brand revenue if applicable.',
    type: 'text',
    required: true,
    placeholder: 'e.g., $500K-$2M, or $10M+ across portfolio companies',
    step: 1,
    stepTitle: 'WHO YOU ARE',
  },
  {
    name: 'idealCustomer',
    label: 'Who is your ideal customer? Describe them in detail (Age, role, revenue, family status, habits, mindset).',
    type: 'textarea',
    required: true,
    placeholder: 'Paint a detailed picture of your perfect customer...',
    step: 2,
    stepTitle: 'YOUR CUSTOMER',
  },
  {
    name: 'mainProblem',
    label: 'What is the #1 problem you solve for them? What is the specific bottleneck killing their growth?',
    type: 'textarea',
    required: true,
    placeholder: 'Identify the core pain point and growth blocker...',
    step: 2,
    stepTitle: 'YOUR CUSTOMER',
  },
  {
    name: 'customerTransformation',
    label: 'What transformation do your customers experience? Describe the "Before" vs. the "After" (Revenue, time, stress levels).',
    type: 'textarea',
    required: true,
    placeholder: 'Describe the journey from problem to solution...',
    step: 2,
    stepTitle: 'YOUR CUSTOMER',
  },
  {
    name: 'referralLanguage',
    label: 'What do customers say when they refer you? What specific words or internal vocabulary do they use?',
    type: 'textarea',
    required: true,
    placeholder: 'Capture the exact language and phrases your customers use...',
    step: 2,
    stepTitle: 'YOUR CUSTOMER',
  },
  {
    name: 'coreOffers',
    label: 'What do you sell? Describe your core offer(s). Include free, mid-tier, and high-ticket/equity partnership levels.',
    type: 'textarea',
    required: true,
    placeholder: 'Detail your product/service tiers and pricing structure...',
    step: 3,
    stepTitle: 'YOUR OFFER & MODEL',
  },
  {
    name: 'differentiation',
    label: 'What makes your offer different from competitors? Focus on your receipts, aligned incentives, or volume of free value.',
    type: 'textarea',
    required: true,
    placeholder: 'Explain what sets you apart and proves your value...',
    step: 3,
    stepTitle: 'YOUR OFFER & MODEL',
  },
  {
    name: 'customerAcquisition',
    label: 'What is your primary way of getting customers right now?',
    type: 'select',
    required: true,
    placeholder: 'Select your primary acquisition channel...',
    options: ['Content', 'Outbound', 'Referrals', 'Paid Ads'],
    step: 3,
    stepTitle: 'YOUR OFFER & MODEL',
  },
  {
    name: 'salesProcess',
    label: 'What does your sales process look like? Step-by-step from initial contact to closing.',
    type: 'textarea',
    required: true,
    placeholder: 'Map out your complete sales funnel...',
    step: 3,
    stepTitle: 'YOUR OFFER & MODEL',
  },
];

const quickAnswerMap: Record<keyof FormData, string[]> = {
  companyDescription: [
    'We help founders accelerate revenue with data-backed systems.',
    'We build high-growth operations for scaling B2B businesses.',
    'We design premium 1-1 consulting systems for elite leaders.',
  ],
  industryNiche: [
    'High-end consulting for CEOs in SaaS and growth teams.',
    'Luxury brand operators in retail, beauty, and premium services.',
    'Modern business performance engineering for service-based founders.',
  ],
  businessHistory: [
    'We have been operating for 5 years with a strong enterprise playbook.',
    'Our team has built multiple productized services for category leaders.',
    'I have 10+ years of consulting experience in high-growth markets.',
  ],
  revenueRange: [
    '$500K-$2M in annual revenue.',
    '$2M-$5M with consistent recurring client contracts.',
    '$10M+ across our portfolio and high-ticket offers.',
  ],
  idealCustomer: [
    'An ambitious founder running a $1M+ SaaS business.',
    'A premium service brand seeking operational leverage.',
    'A growth leader focused on scale, retention, and efficiency.',
  ],
  mainProblem: [
    'They struggle with inconsistent lead flow and sales execution.',
    'Their growth is blocked by weak systems and unclear offers.',
    'They are losing margin because their operations are not repeatable.',
  ],
  customerTransformation: [
    'Before: chaotic, manual, underperforming. After: systematic, profitable, calm.',
    'Before: inconsistent revenue. After: predictable sales and fewer fires.',
    'Before: stressed founders. After: scalable systems and clear growth.',
  ],
  referralLanguage: [
    'He helped me simplify my business and scale without burnout.',
    'Their system made everything clearer and more profitable.',
    'They speak our language and solve the problems we actually face.',
  ],
  coreOffers: [
    'A free diagnostic, a mid-tier accelerator, and a high-ticket equity partnership.',
    'Operational consulting, systems coaching, and performance retainers.',
    'Productized frameworks, premium implementation, and strategic advisory.',
  ],
  differentiation: [
    'We align incentives and deliver measurable system-level results.',
    'Our work is backed by proven operational receipts and execution.',
    'We offer free value at every stage before high-ticket partnership.',
  ],
  customerAcquisition: ['Content', 'Referrals', 'Paid Ads', 'Outbound'],
  salesProcess: [
    'Discovery call -> strategy proposal -> high-ticket close.',
    'Content lead -> qualification -> consult -> implement.',
    'Inbound meeting -> diagnostics -> proposal -> onboarding.',
  ],
};

const getAdaptiveBusinessHistorySuggestions = (industryNiche: string) => {
  const normalized = industryNiche.toLowerCase();

  if (normalized.includes('beauty') || normalized.includes('retail')) {
    return [
      'Built a DTC beauty brand with premium operational systems.',
      'Scaled retail growth through focused customer experience design.',
      'Helped beauty retail founders improve retention and margins.',
    ];
  }

  if (normalized.includes('saas')) {
    return [
      'Scaled a SaaS product from pre-launch to $2M ARR.',
      'Built subscription growth systems for software founders.',
      'Led product-led growth for B2B SaaS teams.',
    ];
  }

  if (normalized.includes('service') || normalized.includes('consult')) {
    return [
      'Delivered consulting engagements for high-growth founders.',
      'Built service frameworks for repeatable client delivery.',
      'Enabled operators to scale service revenue and efficiency.',
    ];
  }

  return quickAnswerMap.businessHistory;
};

const getQuickAnswers = (questionName: keyof FormData, industryNiche: string) => {
  if (questionName === 'businessHistory') {
    return getAdaptiveBusinessHistorySuggestions(industryNiche);
  }

  return quickAnswerMap[questionName] || [];
};

const BusinessContextQuestionnaire: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [formCompleted, setFormCompleted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({ mode: 'onChange' });
  const currentQuestion = questions[currentQuestionIndex];
  const currentStep = currentQuestion.step;
  const totalQuestions = questions.length;
  const questionsInCurrentStep = questions.filter(q => q.step === currentStep).length;
  const questionIndexInStep = questions.slice(0, currentQuestionIndex + 1).filter(q => q.step === currentStep).length;

  const industryNicheValue = watch('industryNiche') ?? '';
  const quickAnswers = useMemo(() => getQuickAnswers(currentQuestion.name, industryNicheValue), [currentQuestion.name, industryNicheValue]);

  useEffect(() => {
    setHydrated(true);
    const saved = typeof window !== 'undefined' && localStorage.getItem('formCompleted') === 'true';
    setFormCompleted(saved);
  }, []);

  useEffect(() => {
    const savedValue = watch(currentQuestion.name) ?? '';
    setInputValue(savedValue);
  }, [currentQuestionIndex, currentQuestion.name, watch]);

  const nextQuestion = () => {
    if (!inputValue.trim()) return;

    setValue(currentQuestion.name, inputValue);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const prevQuestion = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
      setIsTransitioning(false);
    }, 300);
  };

  const submitForm = async (data: FormData) => {
    try {
      const response = await fetch('https://formspree.io/f/xvzlvnbe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        localStorage.setItem('formCompleted', 'true');
        setFormCompleted(true);
      } else {
        alert('There was an error submitting your questionnaire. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your questionnaire. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentQuestionIndex < totalQuestions - 1) {
        nextQuestion();
      } else {
        handleSubmit(submitForm)();
      }
    }
  };

  const handleQuickAnswer = (value: string) => {
    setInputValue(value);
    setValue(currentQuestion.name, value);
  };

  const { ref, ...registerProps } = register(currentQuestion.name, { required: currentQuestion.required });
  const fieldClasses = `w-full px-6 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-transparent dark:bg-slate-800/50 border-gray-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 ${
    errors[currentQuestion.name] ? 'border-red-500 dark:border-red-400' : ''
  }`;

  if (!hydrated) {
    return null;
  }

  if (formCompleted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white transition-colors duration-500">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-white mb-8">
            Questionnaire Submitted
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold mb-6">Thanks. We’ve received your questionnaire.</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            We’ll review your business, systems, and goals, then reach out with the next steps.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-white text-slate-950 px-8 py-4 font-semibold shadow-lg hover:bg-slate-100 transition"
            >
              Return to Command Center
            </Link>
            <Link
              href="/business-tools"
              className="inline-flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-white px-8 py-4 font-semibold shadow-lg hover:bg-slate-700 transition"
            >
              Explore Software Suite
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderField = () => {
    if (currentQuestion.type === 'textarea') {
      return (
        <textarea
          {...registerProps}
          ref={ref}
          rows={2}
          value={inputValue}
          onChange={e => {
            registerProps.onChange?.(e);
            setInputValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className={`${fieldClasses} resize-none min-h-[5rem]`}
          placeholder={currentQuestion.placeholder}
        />
      );
    }

    if (currentQuestion.type === 'select') {
      return (
        <select
          {...registerProps}
          ref={ref}
          value={inputValue}
          onChange={e => {
            registerProps.onChange?.(e);
            setInputValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className={`${fieldClasses} cursor-pointer`}
        >
          <option value="" className="text-slate-400 bg-transparent">Select an option...</option>
          {currentQuestion.options?.map(option => (
            <option key={option} value={option} className="text-slate-900 dark:text-slate-100 bg-transparent">
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        {...registerProps}
        ref={ref}
        type={currentQuestion.type}
        value={inputValue}
        onChange={e => {
          registerProps.onChange?.(e);
          setInputValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        className={fieldClasses}
        placeholder={currentQuestion.placeholder}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
            Tell Us About Your Business
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Please fill this out with as much specificity as possible. Use real numbers, specific names of frameworks, and the actual language your customers use.
          </p>
        </div>

        <div className="mb-12">
          <div className="flex justify-center items-center mb-6">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep > step ? 'bg-green-500 text-white shadow-lg' :
                  currentStep === step ? 'bg-blue-600 text-white shadow-lg scale-110' :
                  'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-20 h-1 mx-4 rounded transition-all duration-300 ${
                    currentStep > step ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
              {currentQuestion.stepTitle}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Question {questionIndexInStep} of {questionsInCurrentStep} • Step {currentStep} of 3
            </div>
          </div>
        </div>

        <div className="relative">
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-slate-900/50 p-8 md:p-12 border border-transparent">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                  {currentQuestion.label}
                  {currentQuestion.required && <span className="text-red-500 ml-2">*</span>}
                </h2>
                <div className="space-y-4" key={`field-${currentQuestionIndex}`}>
                  {renderField()}
                  {quickAnswers.length > 0 && currentQuestion.type !== 'select' && (
                    <div className="flex flex-wrap gap-3">
                      {quickAnswers.slice(0, 4).map(answer => (
                        <button
                          key={answer}
                          type="button"
                          onClick={() => handleQuickAnswer(answer)}
                          className="rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          {answer}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors[currentQuestion.name] && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2">This field is required</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                    currentQuestionIndex === 0
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 hover:shadow-md'
                  }`}
                >
                  Previous
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    disabled={!inputValue.trim()}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                      inputValue.trim()
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit(submitForm)}
                    disabled={!inputValue.trim()}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                      inputValue.trim()
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    Submit Questionnaire
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessContextQuestionnaire;
