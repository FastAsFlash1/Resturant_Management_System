import React, { createContext, useContext, useState } from 'react';

interface RestaurantSignupData {
  // Step 1: Restaurant & Owner Details
  restaurantName: string;
  ownerName: string;
  location: string;
  establishmentYear: string;
  document: File | null;
  documentUrl?: string;
  
  // Step 2: Services & Payment
  selectedServices: string[];
  totalAmount: number;
  installmentPlan: {
    amount: number;
    months: number;
  };
  
  // Step 3: Account Setup
  restaurantId: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface SignupContextType {
  signupData: RestaurantSignupData;
  updateSignupData: (data: Partial<RestaurantSignupData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  resetSignup: () => void;
}

const initialSignupData: RestaurantSignupData = {
  restaurantName: '',
  ownerName: '',
  location: '',
  establishmentYear: '',
  document: null,
  documentUrl: '',
  selectedServices: [],
  totalAmount: 0,
  installmentPlan: { amount: 0, months: 3 },
  restaurantId: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signupData, setSignupData] = useState<RestaurantSignupData>(initialSignupData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateSignupData = (data: Partial<RestaurantSignupData>) => {
    setSignupData(prev => ({ ...prev, ...data }));
  };

  const resetSignup = () => {
    setSignupData(initialSignupData);
    setCurrentStep(1);
  };

  return (
    <SignupContext.Provider
      value={{
        signupData,
        updateSignupData,
        currentStep,
        setCurrentStep,
        resetSignup,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error('useSignup must be used within SignupProvider');
  }
  return context;
};