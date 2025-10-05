import React from 'react';
import { SignupProvider, useSignup } from '@/contexts/SignupContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Step1 from '@/components/signup/Step1';
import Step2 from '@/components/signup/Step2';
import Step3 from '@/components/signup/Step3';

const SignupSteps: React.FC = () => {
  const { currentStep } = useSignup();

  const steps = [
    { number: 1, title: 'Restaurant Details', description: 'Basic information' },
    { number: 2, title: 'Choose Services', description: 'Select your plan' },
    { number: 3, title: 'Set Password', description: 'Secure your account' }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FastAsFlash
              </span>
            </Link>
            
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all
                      ${currentStep >= step.number
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500'
                      }
                    `}
                  >
                    {step.number}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={`
                        font-medium text-sm
                        ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'}
                      `}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {step.description}
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-20 h-1 mx-4 rounded transition-all
                      ${currentStep > step.number ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="max-w-4xl mx-auto">
          {renderStep()}
        </div>

        {/* Help Text */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-700">
                💡 <strong>Need help?</strong> Contact our support team at{' '}
                <a href="mailto:support@fastasflash.com" className="underline">
                  support@fastasflash.com
                </a>{' '}
                or call +91 9876543210
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Signup: React.FC = () => {
  return (
    <SignupProvider>
      <SignupSteps />
    </SignupProvider>
  );
};

export default Signup;