import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Key,
  Shield,
  Building,
  Settings,
  LogOut,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  restaurantId: string;
  restaurantName: string;
  ownerName: string;
  phoneNumber: string;
  location?: string;
  establishmentYear?: number;
  selectedServices: string[];
  planAmount: number;
  documentUrl?: string;
  createdAt: string;
  lastLogin?: string;
}

const AdminProfile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  
  // Password change state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiService.getProfile();
      if (response.success) {
        setProfile(response.data);
        setEditedName(response.data.ownerName);
      } else {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load profile",
        variant: "destructive"
      });
      // If token is invalid, logout
      if (error.message?.includes('token') || error.message?.includes('401')) {
        logout();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!editedName.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    setIsUpdatingName(true);
    try {
      const response = await apiService.updateUsername({ ownerName: editedName.trim() });
      if (response.success) {
        setProfile(prev => prev ? { ...prev, ownerName: editedName.trim() } : null);
        updateUser({ ownerName: editedName.trim() });
        setIsEditingName(false);
        toast({
          title: "Success",
          description: "Username updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update username",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const validatePasswordChange = () => {
    const errors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordChange()) return;

    setIsChangingPassword(true);
    try {
      const response = await apiService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
        setShowPasswordDialog(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordErrors({});
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground mb-4">
              Unable to load your profile data.
            </p>
            <Button onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Profile Settings</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your restaurant account
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Restaurant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Restaurant ID
                  </Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-sm">
                      {profile.restaurantId}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Read-only
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Restaurant Name
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{profile.restaurantName}</span>
                    <Badge variant="outline" className="text-xs">
                      Read-only
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Owner Name
                  </Label>
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="flex-1"
                        placeholder="Enter owner name"
                      />
                      <Button
                        size="sm"
                        onClick={handleUpdateName}
                        disabled={isUpdatingName}
                      >
                        {isUpdatingName ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditingName(false);
                          setEditedName(profile.ownerName);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{profile.ownerName}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingName(true)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{profile.phoneNumber}</span>
                    <Badge variant="outline" className="text-xs">
                      Read-only
                    </Badge>
                  </div>
                </div>

                {profile.location && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Location
                    </Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{profile.location}</span>
                    </div>
                  </div>
                )}

                {profile.establishmentYear && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Establishment Year
                    </Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{profile.establishmentYear}</span>
                    </div>
                  </div>
                )}
              </div>

              {profile.selectedServices.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Selected Services
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.selectedServices.map((service, index) => (
                      <Badge key={index} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{profile.planAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Plan Amount</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Member Since</div>
                </div>
                {profile.lastLogin && (
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {new Date(profile.lastLogin).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Last Login</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Change your account password
                    </p>
                  </div>
                </div>
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({
                              ...prev,
                              currentPassword: e.target.value
                            }))}
                            className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowPasswords(prev => ({
                              ...prev,
                              current: !prev.current
                            }))}
                          >
                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {passwordErrors.currentPassword && (
                          <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({
                              ...prev,
                              newPassword: e.target.value
                            }))}
                            className={passwordErrors.newPassword ? 'border-red-500' : ''}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowPasswords(prev => ({
                              ...prev,
                              new: !prev.new
                            }))}
                          >
                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {passwordErrors.newPassword && (
                          <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({
                              ...prev,
                              confirmPassword: e.target.value
                            }))}
                            className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowPasswords(prev => ({
                              ...prev,
                              confirm: !prev.confirm
                            }))}
                          >
                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {passwordErrors.confirmPassword && (
                          <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                        )}
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowPasswordDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleChangePassword}
                          disabled={isChangingPassword}
                        >
                          {isChangingPassword ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Changing...
                            </>
                          ) : (
                            'Change Password'
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-800">Account Secured</h4>
                  <p className="text-sm text-green-700">
                    Your account is protected with industry-standard encryption
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;