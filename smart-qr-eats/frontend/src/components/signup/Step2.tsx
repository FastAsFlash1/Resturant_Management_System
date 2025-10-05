import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ShoppingCart, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  CreditCard,
  BarChart3,
  Settings,
  Users,
  Clock,
  Shield
} from 'lucide-react';
import { useSignup } from '@/contexts/SignupContext';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  features: string[];
  popular?: boolean;
}

const services: Service[] = [
  {
    id: 'basic-menu',
    name: 'Basic Menu Management',
    description: 'Essential menu and order management tools',
    price: 5000,
    icon: <Settings className="h-6 w-6" />,
    features: [
      'Menu Creation & Editing',
      'Basic Order Processing',
      'Customer Support',
      'Mobile Responsive Design'
    ]
  },
  {
    id: 'advanced-tracking',
    name: 'Advanced Order Tracking',
    description: 'Real-time order tracking and kitchen management',
    price: 8000,
    icon: <Clock className="h-6 w-6" />,
    features: [
      'Real-time Order Status',
      'Kitchen Display System',
      'SMS/Email Notifications',
      'Multi-location Support',
      'Staff Management'
    ],
    popular: true
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Comprehensive business insights and reporting',
    price: 12000,
    icon: <BarChart3 className="h-6 w-6" />,
    features: [
      'Sales Analytics',
      'Customer Insights',
      'Performance Reports',
      'Revenue Forecasting',
      'Custom Dashboards',
      'Data Export'
    ]
  },
  {
    id: 'customer-engagement',
    name: 'Customer Engagement Suite',
    description: 'Tools to engage and retain customers',
    price: 6000,
    icon: <Users className="h-6 w-6" />,
    features: [
      'Loyalty Programs',
      'Review Management',
      'Marketing Campaigns',
      'Social Media Integration'
    ]
  },
  {
    id: 'security-compliance',
    name: 'Security & Compliance',
    description: 'Advanced security and compliance features',
    price: 4000,
    icon: <Shield className="h-6 w-6" />,
    features: [
      'Data Encryption',
      'GDPR Compliance',
      'Audit Logs',
      'Backup & Recovery'
    ]
  }
];

const Step2: React.FC = () => {
  const { signupData, updateSignupData, setCurrentStep } = useSignup();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleServiceToggle = (serviceId: string) => {
    const currentServices = signupData.selectedServices;
    const isSelected = currentServices.includes(serviceId);
    
    let newServices: string[];
    if (isSelected) {
      newServices = currentServices.filter(id => id !== serviceId);
    } else {
      newServices = [...currentServices, serviceId];
    }
    
    const totalAmount = newServices.reduce((sum, id) => {
      const service = services.find(s => s.id === id);
      return sum + (service?.price || 0);
    }, 0);

    updateSignupData({ 
      selectedServices: newServices,
      totalAmount,
      installmentPlan: {
        amount: Math.round(totalAmount / 3),
        months: 3
      }
    });
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (signupData.selectedServices.length === 0) {
      newErrors.services = 'Please select at least one service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      // Generate unique restaurant ID
      const restaurantId = `REST${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
      updateSignupData({ restaurantId });
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Choose Services & Payment Plan</CardTitle>
        </div>
        <p className="text-muted-foreground">
          Select the services that best fit your restaurant's needs
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {errors.services && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {errors.services}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const isSelected = signupData.selectedServices.includes(service.id);
            
            return (
              <Card 
                key={service.id} 
                className={`
                  relative cursor-pointer transition-all duration-200 hover:shadow-md
                  ${isSelected ? 'ring-2 ring-blue-500 border-blue-200' : 'hover:border-gray-300'}
                  ${service.popular ? 'border-green-200' : ''}
                `}
                onClick={() => handleServiceToggle(service.id)}
              >
                {service.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-green-500">
                    Most Popular
                  </Badge>
                )}
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center
                        ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                      `}>
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <p className="text-2xl font-bold text-blue-600">₹{service.price.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                      className="mt-1"
                    />
                  </div>

                  <p className="text-muted-foreground mb-4">{service.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700">Features included:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {signupData.selectedServices.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Summary
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Services:</h4>
                  {signupData.selectedServices.map(serviceId => {
                    const service = services.find(s => s.id === serviceId);
                    return service ? (
                      <div key={serviceId} className="flex justify-between items-center py-2 border-b border-blue-100 last:border-b-0">
                        <span className="text-sm">{service.name}</span>
                        <span className="font-medium">₹{service.price.toLocaleString()}</span>
                      </div>
                    ) : null;
                  })}
                </div>

                <div className="pt-4 border-t border-blue-200">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">₹{signupData.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium mb-2">💳 Easy Payment Plan</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Month 1</div>
                      <div className="font-semibold">₹{signupData.installmentPlan.amount.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Month 2</div>
                      <div className="font-semibold">₹{signupData.installmentPlan.amount.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Month 3</div>
                      <div className="font-semibold">₹{signupData.installmentPlan.amount.toLocaleString()}</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    *No additional charges or interest
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button onClick={handleBack} variant="outline" size="lg" className="px-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button onClick={handleNext} size="lg" className="px-8">
            Generate Restaurant ID
            <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step2;