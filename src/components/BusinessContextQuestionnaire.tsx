'use client';

import React, { useState, useEffect } from 'react';
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

const BusinessContextQuestionnaire: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>();

  const questions: Question[] = [
    {
      name: "companyDescription",
      label: "What does your company do in one sentence?",
      type: "text",
      required: true,
      placeholder: "e.g., We help SaaS companies scale their customer acquisition through data-driven marketing strategies.",
      step: 1,
      stepTitle: "WHO YOU ARE"
    },
    {
      name: "industryNiche",
      label: "What industry or niche are you in? Specifically: who do you serve and who do you avoid?",
      type: "textarea",
      required: true,
      placeholder: "Describe your target market and any segments you intentionally exclude...",
      step: 1,
      stepTitle: "WHO YOU ARE"
    },
    {
      name: "businessHistory",
      label: "How long have you been in business? Include your professional background and relevant track record.",
      type: "textarea",
      required: true,
      placeholder: "Share your business timeline and professional experience...",
      step: 1,
      stepTitle: "WHO YOU ARE"
    },
    {
      name: "revenueRange",
      label: "What is your approximate annual revenue range? Include portfolio aggregate or personal brand revenue if applicable.",
      type: "text",
      required: true,
      placeholder: "e.g., $500K-$2M, or $10M+ across portfolio companies",
      step: 1,
      stepTitle: "WHO YOU ARE"
    },
    {
      name: "idealCustomer",
      label: "Who is your ideal customer? Describe them in detail (Age, role, revenue, family status, habits, mindset).",
      type: "textarea",
      required: true,
      placeholder: "Paint a detailed picture of your perfect customer...",
      step: 2,
      stepTitle: "YOUR CUSTOMER"
    },
    {
      name: "mainProblem",
      label: "What is the #1 problem you solve for them? What is the specific bottleneck killing their growth?",
      type: "textarea",
      required: true,
      placeholder: "Identify the core pain point and growth blocker...",
      step: 2,
      stepTitle: "YOUR CUSTOMER"
    },
    {
      name: "customerTransformation",
      label: "What transformation do your customers experience? Describe the \"Before\" vs. the \"After\" (Revenue, time, stress levels).",
      type: "textarea",
      required: true,
      placeholder: "Describe the journey from problem to solution...",
      step: 2,
      stepTitle: "YOUR CUSTOMER"
    },
    {
      name: "referralLanguage",
      label: "What do customers say when they refer you? What specific words or internal vocabulary do they use?",
      type: "textarea",
      required: true,
      placeholder: "Capture the exact language and phrases your customers use...",
      step: 2,
      stepTitle: "YOUR CUSTOMER"
    },
    {
      name: "coreOffers",
      label: "What do you sell? Describe your core offer(s). Include free, mid-tier, and high-ticket/equity partnership levels.",
      type: "textarea",
      required: true,
      placeholder: "Detail your product/service tiers and pricing structure...",
      step: 3,
      stepTitle: "YOUR OFFER & MODEL"
    },
    {
      name: "differentiation",
      label: "What makes your offer different from competitors? Focus on your receipts, aligned incentives, or volume of free value.",
      type: "textarea",
      required: true,
      placeholder: "Explain what sets you apart and proves your value...",
      step: 3,
      stepTitle: "YOUR OFFER & MODEL"
    },
    {
      name: "customerAcquisition",
      label: "What is your primary way of getting customers right now?",
      type: "select",
      required: true,
      placeholder: "Select your primary acquisition channel...",
      options: ["Content", "Outbound", "Referrals", "Paid Ads"],
      step: 3,
      stepTitle: "YOUR OFFER & MODEL"
    },
    {
      name: "salesProcess",
      label: "What does your sales process look like? Step-by-step from initial contact to closing.",
      type: "textarea",
      required: true,
      placeholder: "Map out your complete sales funnel...",
      step: 3,
      stepTitle: "YOUR OFFER & MODEL"
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const currentStep = currentQuestion.step;
  const totalQuestions = questions.length;
  const questionsInCurrentStep = questions.filter(q => q.step === currentStep).length;
  const questionIndexInStep = questions.slice(0, currentQuestionIndex + 1).filter(q => q.step === currentStep).length;

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    // Handle form submission here (e.g., send to API)
    alert('Questionnaire submitted successfully!');
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentQuestionIndex < totalQuestions - 1) {
        nextQuestion();
      } else {
        handleSubmit(onSubmit)();
      }
    }
  };

  // Watch for changes to update form values
  const watchedValue = watch(currentQuestion.name);

  const renderField = () => {
    const fieldProps = {
      ...register(currentQuestion.name, { required: currentQuestion.required }),
      className: `w-full px-6 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-transparent dark:bg-slate-800/50 border-transparent dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 ${
        errors[currentQuestion.name] ? 'border-red-500 dark:border-red-400' : ''
      }`,
      placeholder: currentQuestion.placeholder,
      onKeyPress: handleKeyPress
    };

    if (currentQuestion.type === 'textarea') {
      return <textarea {...fieldProps} rows={6} className={`${fieldProps.className} resize-none`} />;
    } else if (currentQuestion.type === 'select') {
      return (
        <select {...fieldProps} className={`${fieldProps.className} cursor-pointer`}>
          <option value="" className="text-slate-400 bg-transparent">Select an option...</option>
          {currentQuestion.options?.map((option: string) => (
            <option key={option} value={option} className="text-slate-900 dark:text-slate-100 bg-transparent">{option}</option>
          ))}
        </select>
      );
    } else {
      return <input {...fieldProps} type={currentQuestion.type} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
            Tell Us About Your Business
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Please fill this out with as much specificity as possible. Use real numbers, specific names of frameworks, and the actual language your customers use.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex justify-center items-center mb-6">
            {[1, 2, 3].map((step) => (
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

        {/* Question Container */}
        <div className="relative">
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-slate-900/50 p-8 md:p-12 border border-transparent">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                  {currentQuestion.label}
                  {currentQuestion.required && <span className="text-red-500 ml-2">*</span>}
                </h2>
                <div className="space-y-1">
                  {renderField()}
                  {errors[currentQuestion.name] && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2">This field is required</p>
                  )}
                </div>
              </div>

              {/* Navigation */}
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
                    disabled={!watchedValue?.trim()}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                      watchedValue?.trim()
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={!watchedValue?.trim()}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                      watchedValue?.trim()
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