import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  LogIn, 
  User, 
  Lock, 
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Smartphone,
  IdCard
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithCredentials, isAuthenticated, user, role, loading } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && isAuthenticated && user && role) {
      console.log('🟢 Already authenticated, redirecting based on role...');
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'kitchen') {
        navigate('/kitchen', { replace: true });
      }
    }
  }, [isAuthenticated, user, role, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Checking authentication...</span>
        </div>
      </div>
    );
  }

  const isPhoneNumber = /^[0-9]{10}$/.test(formData.identifier);
  const isRestaurantId = /^RID[0-9]{6}$/.test(formData.identifier);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    console.log('🔵 Login attempt:', { identifier: formData.identifier });

    try {
      const result = await loginWithCredentials(formData);
      
      if (result.success) {
        console.log('🟢 Login successful');
        
        toast({
          title: "Login Successful! 🎉",
          description: result.message || 'Welcome back!',
        });

        // Navigation will be handled by the useEffect when auth state updates
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (error: any) {
      console.error('🔴 Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInputIcon = () => {
    if (isPhoneNumber) return <Smartphone className="h-4 w-4" />;
    if (isRestaurantId) return <IdCard className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  const getPlaceholderText = () => {
    if (isPhoneNumber) return "Phone number detected";
    if (isRestaurantId) return "Restaurant ID detected";
    return "Restaurant ID, Phone Number, or Kitchen Username";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <LogIn className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <p className="text-gray-600 text-sm mt-2">
            Sign in to your FastAsFlash dashboard
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-sm font-medium">
                Login Identifier *
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  {getInputIcon()}
                </div>
                <Input
                  id="identifier"
                  type="text"
                  placeholder={getPlaceholderText()}
                  value={formData.identifier}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    setFormData({ ...formData, identifier: value });
                    setError('');
                  }}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center space-x-2">
                  <IdCard className="h-3 w-3" />
                  <span>Admin: Restaurant ID (RID123456) or Phone (10 digits)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-3 w-3" />
                  <span>Kitchen: Username provided by admin</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password *
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setError('');
                  }}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                  Create one here
                </Link>
              </p>
              
              <div className="flex items-center justify-center">
                <Link 
                  to="/" 
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Home
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;