import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  LogIn, 
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  Key,
  Phone,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Restaurant ID or Phone Number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await apiService.login({
        identifier: formData.identifier,
        password: formData.password
      });

      if (response.success) {
        // Store authentication data
        login(response.data.restaurant, response.data.token);
        
        toast({
          title: "Login Successful! 🎉",
          description: `Welcome back, ${response.data.restaurant.ownerName}!`,
        });
        
        // Redirect to admin panel
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      } else {
        toast({
          title: "Login Failed",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message || 'Failed to log in. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isPhoneNumber = (str: string) => /^[0-9]{10}$/.test(str);

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
            
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Join FastAsFlash</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Welcome Card */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <LogIn className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-muted-foreground">
              Sign in to access your restaurant dashboard
            </p>
          </div>

          {/* Login Form */}
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                Restaurant Login
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="flex items-center gap-2">
                  {isPhoneNumber(formData.identifier) ? (
                    <Phone className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  Restaurant ID or Phone Number *
                </Label>
                <Input
                  id="identifier"
                  placeholder="Restaurant ID (e.g., RID123456) or Phone Number (10 digits)"
                  value={formData.identifier}
                  onChange={(e) => handleInputChange('identifier', e.target.value)}
                  className={`${isPhoneNumber(formData.identifier) ? '' : 'font-mono'} ${errors.identifier ? 'border-red-500' : ''}`}
                />
                {errors.identifier && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.identifier}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {isPhoneNumber(formData.identifier) 
                    ? "Using phone number login" 
                    : "You can use either your Restaurant ID or registered phone number"
                  }
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
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
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot Restaurant ID?
                </a>
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <Button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In to Dashboard
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                    Join FastAsFlash
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="mt-6 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Badge className="bg-yellow-500">Demo</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-yellow-800 mb-2">Try Demo Account</h4>
                  <div className="space-y-1 text-sm text-yellow-700">
                    <p><strong>ID:</strong> RID123456 or Phone: 9876543210</p>
                    <p><strong>Password:</strong> Demo123456</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                    onClick={() => {
                      setFormData({
                        identifier: 'RID123456',
                        password: 'Demo123456'
                      });
                    }}
                  >
                    Use Demo Credentials
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Your data is protected with bank-level security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;