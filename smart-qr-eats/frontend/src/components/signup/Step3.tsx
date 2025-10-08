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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (!signupData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = async () => {
    console.log('🔵 Starting signup process...');
    console.log('🔵 Current signup data:', signupData);
    
    if (!validateStep()) {
      console.log('🔴 Validation failed:', errors);
      return;
    }

    setIsLoading(true);

    try {
      // Prepare payload to match your backend exactly
      const signupPayload = {
        restaurantName: signupData.restaurantName || '',
        ownerName: signupData.ownerName || '',
        location: signupData.location || '',
        establishmentYear: parseInt(signupData.establishmentYear) || new Date().getFullYear(),
        phoneNumber: signupData.phoneNumber,
        password: signupData.password,
        documentUrl: signupData.documentUrl || '',
        selectedServices: Array.isArray(signupData.selectedServices) ? signupData.selectedServices : [],
        planAmount: parseFloat(signupData.totalAmount) || 0
      };

      console.log('🔵 Signup payload being sent:', signupPayload);

      // Make API call
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupPayload),
      });

      console.log('🔵 Response status:', response.status);
      console.log('🔵 Response headers:', response.headers);

      // Get response text first
      const responseText = await response.text();
      console.log('🔵 Raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('🔴 Failed to parse JSON response:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('🔵 Parsed response:', result);

      if (!response.ok) {
        console.error('🔴 HTTP Error:', response.status, result);
        throw new Error(result.message || `HTTP ${response.status}: Signup failed`);
      }

      // Check for success response
      if (result.success && result.data && result.data.restaurantId) {
        console.log('🟢 Signup successful!');
        console.log('🟢 Restaurant ID:', result.data.restaurantId);
        
        setGeneratedRestaurantId(result.data.restaurantId);
        setIsCompleted(true);
        
        // Store token if provided
        if (result.data.token) {
          localStorage.setItem('authToken', result.data.token);
          console.log('🟢 Auth token stored');
        }
        
        toast({
          title: "Account Created Successfully! 🎉",
          description: result.message || "Your restaurant account has been created!",
        });
      } else {
        console.error('🔴 Invalid response structure:', result);
        throw new Error(result.message || 'Signup failed - invalid response from server');
      }
    } catch (error: any) {
      console.error('🔴 Signup error:', error);
      console.error('🔴 Error stack:', error.stack);
      
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.message.includes('already exists')) {
        errorMessage = 'A restaurant with this phone number already exists.';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Please check your input and try again.';
      } else if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.log('🔴 Showing error message:', errorMessage);
      
      toast({
        title: "Signup Failed",
        description: errorMessage,
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
    navigator.clipboard.writeText(generatedRestaurantId);
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
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(signupData.password || '');
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  // Success screen
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <PartyPopper className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">Welcome to FastAsFlash!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Your restaurant account has been created successfully!</p>
              
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                <Label className="text-sm font-medium text-gray-700">Your Restaurant ID</Label>
                <div className="flex items-center justify-center mt-2 space-x-2">
                  <Badge variant="secondary" className="text-lg px-4 py-2 font-mono">
                    {generatedRestaurantId}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyRestaurantId}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Save this ID - you'll need it to login to your Admin Panel
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Next Steps:</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Use your Restaurant ID: <strong>{generatedRestaurantId}</strong></li>
                    <li>• Or use your phone number: <strong>{signupData.phoneNumber}</strong></li>
                    <li>• Access your Admin Panel to manage your restaurant</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={() => window.location.href = '/login'} 
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Go to Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'} 
                className="flex-1"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main signup form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Key className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Set Your Password</CardTitle>
          <p className="text-gray-600 text-sm mt-2">
            Create a secure password for your restaurant account
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Phone Number *
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={signupData.phoneNumber || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                updateSignupData({ phoneNumber: value });
                if (errors.phoneNumber) {
                  setErrors({ ...errors, phoneNumber: '' });
                }
              }}
              className={`${errors.phoneNumber ? 'border-red-500' : ''}`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.phoneNumber}
              </p>
            )}
            <p className="text-xs text-gray-500">
              You can use this phone number or your Restaurant ID to log in.
            </p>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={signupData.password || ''}
                onChange={(e) => {
                  updateSignupData({ password: e.target.value });
                  if (errors.password) {
                    setErrors({ ...errors, password: '' });
                  }
                }}
                className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Password Strength Indicator */}
            {signupData.password && (
              <div className="space-y-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full ${
                        i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600">
                  Password strength: <span className="font-medium">{strengthLabels[passwordStrength - 1] || 'Very Weak'}</span>
                </p>
              </div>
            )}

            {errors.password && (
              <p className="text-red-500 text-xs flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={signupData.confirmPassword || ''}
                onChange={(e) => {
                  updateSignupData({ confirmPassword: e.target.value });
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: '' });
                  }
                }}
                className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
            <div className="space-y-1">
              <div className="flex items-center text-xs">
                <CheckCircle className={`h-3 w-3 mr-2 ${(signupData.password?.length || 0) >= 8 ? 'text-green-500' : 'text-gray-400'}`} />
                At least 8 characters
              </div>
              <div className="flex items-center text-xs">
                <CheckCircle className={`h-3 w-3 mr-2 ${/[a-z]/.test(signupData.password || '') ? 'text-green-500' : 'text-gray-400'}`} />
                One lowercase letter
              </div>
              <div className="flex items-center text-xs">
                <CheckCircle className={`h-3 w-3 mr-2 ${/[A-Z]/.test(signupData.password || '') ? 'text-green-500' : 'text-gray-400'}`} />
                One uppercase letter
              </div>
              <div className="flex items-center text-xs">
                <CheckCircle className={`h-3 w-3 mr-2 ${/[0-9]/.test(signupData.password || '') ? 'text-green-500' : 'text-gray-400'}`} />
                One number
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Complete Signup
                  <ShieldCheck className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Need help? Contact our support team at{' '}
              <a href="mailto:support@fastasflash.com" className="text-blue-600 hover:underline ml-1">
                support@fastasflash.com
              </a>
              {' '}or call +91 9876543210
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step3;