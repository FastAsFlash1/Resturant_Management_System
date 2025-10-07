import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  Shield, 
  LogOut,
  Settings,
  BarChart3,
  QrCode,
  Users,
  Package,
  CreditCard,
  Bell,
  Download,
  Edit,
  Eye,
  Loader2,
  ChefHat,
  Plus,
  Trash2,
  ExternalLink,
  UtensilsCrossed,
  Key,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { toast } from '@/hooks/use-toast';
import { AddMenuModal } from '@/components/AddMenuModal';

interface KitchenAccount {
  id: string;
  username: string;
  kitchenName: string;
  password: string;
  contactNumber?: string;
  isActive: boolean;
  restaurantId: string;
  createdAt: string;
}

const Admin: React.FC = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { menu, orders } = useRestaurant();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Menu Management State
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  
  // QR Code Management State
  const [tableNumbers, setTableNumbers] = useState<string[]>([]);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  
  // Kitchen Management State
  const [kitchenAccounts, setKitchenAccounts] = useState<KitchenAccount[]>([
    {
      id: 'kit_001',
      username: 'kitchen_main',
      kitchenName: 'Main Kitchen',
      password: 'kitchen123',
      contactNumber: '9876543210',
      isActive: true,
      restaurantId: user?.restaurantId || '',
      createdAt: new Date().toISOString(),
    }
  ]);
  const [showCreateKitchen, setShowCreateKitchen] = useState(false);
  const [newKitchen, setNewKitchen] = useState({
    username: '',
    kitchenName: '',
    password: '',
    contactNumber: '',
    isActive: true
  });
  const [passwordVisible, setPasswordVisible] = useState<{[key: string]: boolean}>({});
  const [copySuccess, setCopySuccess] = useState<{[key: string]: boolean}>({});

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log('🔴 Not authenticated, redirecting to login...');
    return <Navigate to="/login" replace />;
  }

  console.log('🟢 Admin page - User authenticated:', user.restaurantName);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Kitchen Management Functions
  const handleCreateKitchen = () => {
    if (!newKitchen.username || !newKitchen.kitchenName || !newKitchen.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const kitchenAccount: KitchenAccount = {
      id: `kit_${Date.now()}`,
      username: newKitchen.username,
      kitchenName: newKitchen.kitchenName,
      password: newKitchen.password,
      contactNumber: newKitchen.contactNumber,
      isActive: newKitchen.isActive,
      restaurantId: user?.restaurantId || '',
      createdAt: new Date().toISOString(),
    };

    setKitchenAccounts(prev => [...prev, kitchenAccount]);
    setNewKitchen({
      username: '',
      kitchenName: '',
      password: '',
      contactNumber: '',
      isActive: true
    });
    setShowCreateKitchen(false);

    toast({
      title: "Success",
      description: "Kitchen account created successfully!",
    });
  };

  const handleDeleteKitchen = (kitchenId: string) => {
    setKitchenAccounts(prev => prev.filter(k => k.id !== kitchenId));
    toast({
      title: "Success",
      description: "Kitchen account deleted successfully!",
    });
  };

  const handleToggleKitchenStatus = (kitchenId: string) => {
    setKitchenAccounts(prev => 
      prev.map(k => 
        k.id === kitchenId ? { ...k, isActive: !k.isActive } : k
      )
    );
  };

  const handleCopyCredentials = (kitchen: KitchenAccount) => {
    const credentials = `Kitchen Login Details:
Username: ${kitchen.username}
Password: ${kitchen.password}
Kitchen Name: ${kitchen.kitchenName}
Restaurant ID: ${kitchen.restaurantId}`;
    
    navigator.clipboard.writeText(credentials);
    setCopySuccess(prev => ({ ...prev, [kitchen.id]: true }));
    
    setTimeout(() => {
      setCopySuccess(prev => ({ ...prev, [kitchen.id]: false }));
    }, 2000);

    toast({
      title: "Success",
      description: "Kitchen credentials copied to clipboard!",
    });
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewKitchen(prev => ({ ...prev, password }));
  };

  // QR Code Management Functions
  const handleAddTable = () => {
    if (!newTableNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a table number.",
        variant: "destructive"
      });
      return;
    }

    if (tableNumbers.includes(newTableNumber.trim())) {
      toast({
        title: "Error",
        description: "Table number already exists.",
        variant: "destructive"
      });
      return;
    }

    setTableNumbers(prev => [...prev, newTableNumber.trim()]);
    setNewTableNumber('');
    toast({
      title: "Success",
      description: "Table added successfully!",
    });
  };

  const handleRemoveTable = (tableNumber: string) => {
    setTableNumbers(prev => prev.filter(t => t !== tableNumber));
    toast({
      title: "Success",
      description: "Table removed successfully!",
    });
  };

  const generateQRCodeURL = (tableNumber: string) => {
    const baseURL = window.location.origin;
    return `${baseURL}/?table=${tableNumber}`;
  };

  const handleDownloadQR = async (tableNumber: string) => {
    const url = generateQRCodeURL(tableNumber);
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    
    try {
      const response = await fetch(qrCodeURL);
      const blob = await response.blob();
      const downloadURL = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = `table-${tableNumber}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadURL);
      
      toast({
        title: "Success",
        description: "QR code downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <div className="flex items-center min-w-0">
                <div className="bg-blue-600 text-white p-1.5 sm:p-2 rounded-lg">
                  <Building className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    FastAsFlash Admin
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {user.restaurantName}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Badge variant="secondary" className="text-xs hidden sm:flex">
                <Shield className="h-3 w-3 mr-1" />
                {user.restaurantId}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Mobile-first responsive tabs */}
          <div className="w-full overflow-x-auto">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 min-w-fit">
              <TabsTrigger value="overview" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs sm:text-sm">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs sm:text-sm">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="kitchen-mgmt" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Kitchen</span>
              </TabsTrigger>
              <TabsTrigger value="customer-view" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs sm:text-sm">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Customer</span>
              </TabsTrigger>
              <TabsTrigger value="qr-codes" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs sm:text-sm">
                <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">QR</span>
              </TabsTrigger>
              <TabsTrigger value="menu" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs sm:text-sm">
                <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Menu</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs sm:text-sm">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center justify-center space-x-1 px-2 py-2 text-xs sm:text-sm">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium truncate">Total Orders</CardTitle>
                  <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-xl sm:text-2xl font-bold">{orders.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {orders.length > 0 ? `${orders.filter(o => o.status === 'completed').length} completed` : 'No orders yet'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium truncate">Revenue</CardTitle>
                  <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-xl sm:text-2xl font-bold">
                    ₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {orders.length > 0 ? `From ${orders.length} orders` : 'No revenue yet'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium truncate">Menu Items</CardTitle>
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-xl sm:text-2xl font-bold">{menu.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {menu.filter(item => item.available).length} available
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium truncate">Kitchen Accounts</CardTitle>
                  <QrCode className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-xl sm:text-2xl font-bold">{kitchenAccounts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {kitchenAccounts.filter(k => k.isActive).length} active
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No orders yet</p>
                      <p className="text-xs">Orders will appear here once customers start ordering</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Package className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Table {order.tableId}</p>
                              <p className="text-xs text-gray-600">
                                {order.items.length} items • ₹{order.total}
                              </p>
                            </div>
                          </div>
                          <Badge variant={
                            order.status === 'completed' ? 'default' :
                            order.status === 'ready' ? 'secondary' :
                            order.status === 'preparing' ? 'outline' : 'destructive'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      ))}
                      {orders.length > 5 && (
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link to="/kitchen">
                            View All Orders
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('qr-codes')}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate Table QR Codes
                    </Button>

                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('menu')}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Manage Menu Items
                    </Button>

                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('kitchen-mgmt')}
                    >
                      <ChefHat className="h-4 w-4 mr-2" />
                      Kitchen Management
                    </Button>

                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      asChild
                    >
                      <Link to="/?table=demo">
                        <Eye className="h-4 w-4 mr-2" />
                        View Customer Experience
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Restaurant Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Restaurant ID:</span>
                      <Badge variant="secondary">{user.restaurantId}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <Badge variant="outline">₹{user.planAmount?.toLocaleString('en-IN') || '0'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={user.isActive ? "default" : "destructive"}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="text-sm">{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Login:</span>
                      <span className="text-sm">{formatTime(user.lastLogin)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Restaurant Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Restaurant Name</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                        {user.restaurantName}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Owner Name</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        {user.ownerName}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        +91 {user.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        {user.location}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Establishment Year</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {user.establishmentYear}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Restaurant ID</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-gray-500" />
                        {user.restaurantId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Selected Services</h4>
                      <p className="text-sm text-gray-600">Services included in your plan</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {user.selectedServices && user.selectedServices.length > 0 ? (
                      user.selectedServices.map((service, index) => (
                        <Badge key={index} variant="secondary">
                          {service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No services selected</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kitchen Management Tab */}
          <TabsContent value="kitchen-mgmt" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Kitchen Management</h2>
                <p className="text-gray-600 text-sm sm:text-base">Create and manage kitchen accounts for your restaurant</p>
              </div>
              <Dialog open={showCreateKitchen} onOpenChange={setShowCreateKitchen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Kitchen Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Kitchen Account</DialogTitle>
                    <DialogDescription>
                      Create a new kitchen account for your staff to manage orders.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="kitchen-username">Username *</Label>
                      <Input
                        id="kitchen-username"
                        value={newKitchen.username}
                        onChange={(e) => setNewKitchen(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="kitchen_main"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kitchen-name">Kitchen Name *</Label>
                      <Input
                        id="kitchen-name"
                        value={newKitchen.kitchenName}
                        onChange={(e) => setNewKitchen(prev => ({ ...prev, kitchenName: e.target.value }))}
                        placeholder="Main Kitchen"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kitchen-password">Password *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="kitchen-password"
                          type={passwordVisible.new ? 'text' : 'password'}
                          value={newKitchen.password}
                          onChange={(e) => setNewKitchen(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter password"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateRandomPassword}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPasswordVisible(prev => ({ ...prev, new: !prev.new }))}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kitchen-contact">Contact Number</Label>
                      <Input
                        id="kitchen-contact"
                        value={newKitchen.contactNumber}
                        onChange={(e) => setNewKitchen(prev => ({ ...prev, contactNumber: e.target.value }))}
                        placeholder="9876543210"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="kitchen-active"
                        checked={newKitchen.isActive}
                        onCheckedChange={(checked) => setNewKitchen(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="kitchen-active">Active Account</Label>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateKitchen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateKitchen}>
                      Create Kitchen Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {kitchenAccounts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Kitchen Accounts</h3>
                    <p className="text-gray-600 mb-6">Create your first kitchen account to get started.</p>
                    <Button onClick={() => setShowCreateKitchen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Kitchen Account
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                kitchenAccounts.map((kitchen) => (
                  <Card key={kitchen.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <ChefHat className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{kitchen.kitchenName}</CardTitle>
                            <p className="text-sm text-gray-600">@{kitchen.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={kitchen.isActive ? "default" : "secondary"}>
                            {kitchen.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Switch
                            checked={kitchen.isActive}
                            onCheckedChange={() => handleToggleKitchenStatus(kitchen.id)}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Username</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {kitchen.username}
                            </code>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">Password</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                              {passwordVisible[kitchen.id] ? kitchen.password : '••••••••'}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPasswordVisible(prev => ({ 
                                ...prev, 
                                [kitchen.id]: !prev[kitchen.id] 
                              }))}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {kitchen.contactNumber && (
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Contact</Label>
                            <p className="text-sm text-gray-900 mt-1">+91 {kitchen.contactNumber}</p>
                          </div>
                        )}

                        <div>
                          <Label className="text-sm font-medium text-gray-700">Created</Label>
                          <p className="text-sm text-gray-900 mt-1">{formatDate(kitchen.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-4 border-t gap-3 sm:gap-0">
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyCredentials(kitchen)}
                            className="w-full sm:w-auto text-xs"
                          >
                            {copySuccess[kitchen.id] ? (
                              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            )}
                            Copy Credentials
                          </Button>
                          <Button variant="outline" size="sm" asChild className="w-full sm:w-auto text-xs">
                            <Link to="/kitchen">
                              <ChefHat className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Open Kitchen
                            </Link>
                          </Button>
                        </div>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 w-full sm:w-auto text-xs">
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Kitchen Account</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the kitchen account "{kitchen.kitchenName}"? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteKitchen(kitchen.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Account
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Customer View Tab */}
          <TabsContent value="customer-view" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Customer View Preview</h2>
                <p className="text-gray-600 text-sm sm:text-base">See exactly what your customers see when they scan QR codes</p>
              </div>
              <Button asChild className="w-full sm:w-auto">
                <Link to="/?table=preview" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Customer View
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UtensilsCrossed className="h-5 w-5" />
                  <span>Customer Experience Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">What customers see:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">1</span>
                      </div>
                      <p className="text-gray-700">Scan QR code at their table</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">2</span>
                      </div>
                      <p className="text-gray-700">Browse your menu with categories and filters</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">3</span>
                      </div>
                      <p className="text-gray-700">Add items to cart and customize orders</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">4</span>
                      </div>
                      <p className="text-gray-700">Choose payment method and place order</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">5</span>
                      </div>
                      <p className="text-gray-700">Track order status in real-time</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className={`border-2 transition-colors ${menu.length > 0 ? 'border-green-200 bg-green-50' : 'border-dashed border-gray-200'}`}>
                    <CardContent className="p-4 text-center">
                      <Package className={`h-8 w-8 mx-auto mb-2 ${menu.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                      <h4 className="font-medium text-gray-900">Menu Items</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {menu.length} items, {menu.filter(item => item.available).length} available
                      </p>
                      <Button variant="outline" size="sm" className="mt-3" onClick={() => setActiveTab('menu')}>
                        {menu.length > 0 ? 'Manage Menu' : 'Add Items'}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed border-gray-200">
                    <CardContent className="p-4 text-center">
                      <QrCode className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900">QR Codes</h4>
                      <p className="text-sm text-gray-600 mt-1">Generate table QR codes</p>
                      <Button variant="outline" size="sm" className="mt-3" onClick={() => setActiveTab('qr-codes')}>
                        Generate QR
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className={`border-2 transition-colors ${kitchenAccounts.filter(k => k.isActive).length > 0 ? 'border-green-200 bg-green-50' : 'border-dashed border-gray-200'}`}>
                    <CardContent className="p-4 text-center">
                      <ChefHat className={`h-8 w-8 mx-auto mb-2 ${kitchenAccounts.filter(k => k.isActive).length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                      <h4 className="font-medium text-gray-900">Kitchen Ready</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {kitchenAccounts.filter(k => k.isActive).length} active of {kitchenAccounts.length} total
                      </p>
                      <Button variant="outline" size="sm" className="mt-3" onClick={() => setActiveTab('kitchen-mgmt')}>
                        Manage Kitchen
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Bell className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-900">Getting Started</h4>
                      <p className="text-amber-700 text-sm mt-1">
                        To enable customer ordering, make sure you have:
                      </p>
                      <ul className="text-amber-700 text-sm mt-2 space-y-1">
                        <li>• Added menu items with prices</li>
                        <li>• Generated QR codes for tables</li>
                        <li>• Set up kitchen accounts for order management</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Codes Tab */}
          <TabsContent value="qr-codes" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">QR Code Management</h2>
                <p className="text-gray-600 text-sm sm:text-base">Generate QR codes for your restaurant tables</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Table number (e.g., T1, Table-01)"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  className="w-full sm:w-48"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTable()}
                />
                <Button onClick={handleAddTable} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Table
                </Button>
              </div>
            </div>

            {tableNumbers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No QR Codes Yet</h3>
                  <p className="text-gray-600 mb-6">Add your first table to generate QR codes for contactless ordering.</p>
                  <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <Input
                      placeholder="Enter table number"
                      value={newTableNumber}
                      onChange={(e) => setNewTableNumber(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTable()}
                    />
                    <Button onClick={handleAddTable}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Table
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {tableNumbers.map((tableNumber) => (
                  <Card key={tableNumber} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="font-semibold text-lg">Table {tableNumber}</h3>
                          <p className="text-sm text-gray-600">Scan to order</p>
                        </div>
                        
                        <div className="flex justify-center">
                          <div className="bg-white p-2 rounded-lg border">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(generateQRCodeURL(tableNumber))}`}
                              alt={`QR Code for Table ${tableNumber}`}
                              className="w-30 h-30"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs"
                            onClick={() => handleDownloadQR(tableNumber)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download QR
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs"
                            onClick={() => {
                              navigator.clipboard.writeText(generateQRCodeURL(tableNumber));
                              toast({
                                title: "Success",
                                description: "Table URL copied to clipboard!",
                              });
                            }}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy URL
                          </Button>

                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs text-red-600 hover:text-red-700"
                            onClick={() => handleRemoveTable(tableNumber)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Menu Management</h2>
                <p className="text-gray-600 text-sm sm:text-base">Manage your restaurant's menu items</p>
              </div>
              <Button onClick={() => setShowAddMenuModal(true)} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </Button>
            </div>

            {menu.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Menu Items</h3>
                  <p className="text-gray-600 mb-6">Add your first menu item to start accepting orders.</p>
                  <Button onClick={() => setShowAddMenuModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Menu Item
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {menu.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 relative">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
                        }}
                      />
                      <Badge 
                        variant={item.available ? "default" : "secondary"}
                        className="absolute top-2 right-2"
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{item.name}</h3>
                          <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        {item.description && (
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1 text-xs">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 text-xs text-red-600">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Add Menu Modal */}
            <AddMenuModal 
              isOpen={showAddMenuModal}
              onClose={() => setShowAddMenuModal(false)}
              onSuccess={() => {
                setShowAddMenuModal(false);
                toast({
                  title: "Success",
                  description: "Menu item added successfully!",
                });
              }}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <p className="text-sm text-gray-600">
                  Track your restaurant's performance and customer insights
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600 mb-6">Start receiving orders to see detailed analytics and reports.</p>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <p className="text-sm text-gray-600">
                  Manage your account preferences and security settings
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications about orders and updates</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Security Settings</h4>
                        <p className="text-sm text-gray-600">Change password and security preferences</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Billing & Subscription</h4>
                        <p className="text-sm text-gray-600">Manage your subscription and payment methods</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
