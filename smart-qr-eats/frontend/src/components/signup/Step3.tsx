import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  ShieldCheck,
  PartyPopper,
  Phone,
  Loader2
} from 'lucide-react';
import { useSignup } from '@/contexts/SignupContext';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

const Step3: React.FC = () => {
  const { signupData, updateSignupData, setCurrentStep, resetSignup } = useSignup();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRestaurantId, setGeneratedRestaurantId] = useState('');

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    // Phone number validation
    if (!signupData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(signupData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
    }

    // Password validation
    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(signupData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!signupData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = async () => {
    if (!validateStep()) {
      return;
    }

    setIsLoading(true);

    try {
      const signupPayload = {
        restaurantName: signupData.restaurantName,
        ownerName: signupData.ownerName,
        location: signupData.location,
        establishmentYear: signupData.establishmentYear,
        phoneNumber: signupData.phoneNumber,
        password: signupData.password,
        documentUrl: signupData.documentUrl || '',
        selectedServices: signupData.selectedServices,
        planAmount: signupData.totalAmount
      };

      const response = await apiService.signup(signupPayload);

      if (response.success) {
        setGeneratedRestaurantId(response.data.restaurantId);
        setIsCompleted(true);
        toast({
          title: "Account Created Successfully! 🎉",
          description: response.message,
        });
      } else {
        toast({
          title: "Signup Failed",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Signup Error",
        description: error.message || 'Failed to create account. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(2);
  };

  const copyRestaurantId = () => {
    const idToCopy = generatedRestaurantId || signupData.restaurantId;
    navigator.clipboard.writeText(idToCopy);
    toast({
      title: "Copied!",
      description: "Restaurant ID copied to clipboard",
    });
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength(signupData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  if (isCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <PartyPopper className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">
              Welcome to FastAsFlash! 🎉
            </h2>
            <p className="text-lg text-muted-foreground">
              Your account has been created successfully!
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-4">Account Summary</h3>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Restaurant:</span>
                <span className="font-medium">{signupData.restaurantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Owner:</span>
                <span className="font-medium">{signupData.ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{signupData.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Restaurant ID:</span>
                <Badge variant="secondary" className="font-mono">
                  {generatedRestaurantId || signupData.restaurantId}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone Number:</span>
                <span className="font-medium">{signupData.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Services:</span>
                <span className="font-medium">{signupData.selectedServices.length} selected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Investment:</span>
                <span className="font-bold text-green-600">₹{signupData.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              onClick={() => window.location.href = '/login'}
            >
              <ShieldCheck className="mr-2 h-5 w-5" />
              Go to Admin Panel
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full"
              onClick={() => {
                resetSignup();
                window.location.href = '/';
              }}
            >
              Back to Home
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Save your Restaurant ID somewhere safe. You'll need it to log in.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Key className="h-6 w-6 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">Set Your Password</CardTitle>
        </div>
        <p className="text-muted-foreground">
          Almost done! Create a secure password for your account
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Phone Number Field */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={signupData.phoneNumber || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                updateSignupData({ phoneNumber: value });
              }}
              className={`pl-10 ${errors.phoneNumber ? 'border-red-500' : ''}`}
              maxLength={10}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.phoneNumber}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            You can use this phone number or your Restaurant ID to log in.
          </p>
        </div>

        {/* Password Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter a strong password"
                value={signupData.password}
                onChange={(e) => updateSignupData({ password: e.target.value })}
                className={errors.password ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            {signupData.password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${
                        i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Password strength: {strengthLabels[passwordStrength - 1] || 'Too weak'}
                </p>
              </div>
            )}
            
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={signupData.confirmPassword}
                onChange={(e) => updateSignupData({ confirmPassword: e.target.value })}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Password Requirements:</h4>
          <ul className="space-y-1 text-sm">
            <li className={`flex items-center gap-2 ${signupData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
              <CheckCircle className="h-4 w-4" />
              At least 8 characters
            </li>
            <li className={`flex items-center gap-2 ${/[a-z]/.test(signupData.password) ? 'text-green-600' : 'text-gray-500'}`}>
              <CheckCircle className="h-4 w-4" />
              One lowercase letter
            </li>
            <li className={`flex items-center gap-2 ${/[A-Z]/.test(signupData.password) ? 'text-green-600' : 'text-gray-500'}`}>
              <CheckCircle className="h-4 w-4" />
              One uppercase letter
            </li>
            <li className={`flex items-center gap-2 ${/\d/.test(signupData.password) ? 'text-green-600' : 'text-gray-500'}`}>
              <CheckCircle className="h-4 w-4" />
              One number
            </li>
          </ul>
        </div>

        <div className="flex justify-between">
          <Button onClick={handleBack} variant="outline" size="lg" className="px-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button 
            onClick={handleComplete} 
            size="lg" 
            className="px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Complete Signup
                <PartyPopper className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step3;