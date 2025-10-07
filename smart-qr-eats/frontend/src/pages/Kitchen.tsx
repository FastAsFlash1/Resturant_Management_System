import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { 
  User, 
  Phone, 
  Building, 
  Shield, 
  LogOut,
  Clock,
  ChefHat,
  Package,
  Loader2,
  Bell,
  CheckCircle2,
  AlertCircle,
  Timer,
  Eye,
  Utensils,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Kitchen: React.FC = () => {
  const { user, logout, isAuthenticated, role, loading } = useAuth();
  const { orders, updateOrderStatus } = useRestaurant();
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Filter orders for kitchen display
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');
  const completedOrders = orders.filter(order => order.status === 'completed');

  const handleStatusUpdate = (orderId: string, newStatus: 'pending' | 'preparing' | 'ready' | 'completed') => {
    updateOrderStatus(orderId, newStatus);
    
    const statusMessages = {
      preparing: 'Order moved to preparing',
      ready: 'Order marked as ready',
      completed: 'Order completed'
    };
    
    if (statusMessages[newStatus]) {
      toast({
        title: "Status Updated",
        description: statusMessages[newStatus],
      });
    }
  };

  const getOrderPriority = (timestamp: Date) => {
    const now = new Date().getTime();
    const orderTime = timestamp.getTime();
    const diffMinutes = (now - orderTime) / (1000 * 60);
    
    if (diffMinutes > 30) return 'high';
    if (diffMinutes > 15) return 'medium'; 
    return 'low';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-gray-600">Loading kitchen dashboard...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (role !== 'kitchen' && role !== 'admin')) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const kitchenUser = user as any; // Kitchen user type

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {role === 'admin' && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Admin
                  </Link>
                </Button>
              )}
              <div className="flex items-center">
                <div className="bg-green-600 text-white p-2 rounded-lg">
                  <ChefHat className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">Kitchen Display</h1>
                  <p className="text-sm text-gray-600">
                    {role === 'admin' ? 'Admin View - Kitchen Display' : kitchenUser.kitchenName}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                {kitchenUser.username}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingOrders.length}</p>
                </div>
                <Bell className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Preparing</p>
                  <p className="text-2xl font-bold text-blue-600">{preparingOrders.length}</p>
                </div>
                <Timer className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ready</p>
                  <p className="text-2xl font-bold text-green-600">{readyOrders.length}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-600">{completedOrders.length}</p>
                </div>
                <Package className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Live Orders</TabsTrigger>
            <TabsTrigger value="preparing">Preparing ({preparingOrders.length})</TabsTrigger>
            <TabsTrigger value="ready">Ready ({readyOrders.length})</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Live Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>New Orders Queue</span>
                  </span>
                  {pendingOrders.length > 0 && (
                    <Badge variant="destructive">{pendingOrders.length} pending</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Orders</h3>
                    <p className="text-gray-600">New orders will appear here automatically.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingOrders.map((order) => {
                      const priority = getOrderPriority(order.timestamp);
                      return (
                        <Card key={order.id} className={`${
                          priority === 'high' ? 'border-red-200 bg-red-50' :
                          priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                          'border-gray-200'
                        }`}>
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <Badge variant="outline">Table {order.tableId}</Badge>
                                <Badge variant="secondary">#{order.id.slice(-4)}</Badge>
                                {priority === 'high' && (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Urgent
                                  </Badge>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">
                                  {order.timestamp.toLocaleTimeString()}
                                </p>
                                <p className="text-lg font-bold text-primary">₹{order.total}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2 mb-4">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium">{item.name}</span>
                                      <Badge variant="outline" className="text-xs">x{item.quantity}</Badge>
                                      {item.customization && (
                                        <Badge variant="outline" className="text-xs bg-blue-50">
                                          Customized
                                        </Badge>
                                      )}
                                    </div>
                                    {item.customization && (
                                      <div className="text-xs text-gray-600 mt-1">
                                        <p>Size: {item.customization.portionSize.name}</p>
                                        {Object.entries(item.customization.customizations).map(([key, value]) => (
                                          <p key={key}>
                                            {key.replace('-', ' ')}: {Array.isArray(value) ? value.join(', ') : value}
                                          </p>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-sm font-medium">
                                    ₹{(item.displayPrice || item.price) * item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center">
                              <Badge variant="outline">{order.paymentType}</Badge>
                              <Button 
                                onClick={() => handleStatusUpdate(order.id, 'preparing')}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Utensils className="h-4 w-4 mr-2" />
                                Start Preparing
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preparing Orders Tab */}
          <TabsContent value="preparing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Timer className="h-5 w-5" />
                  <span>Orders Being Prepared</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {preparingOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Timer className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Being Prepared</h3>
                    <p className="text-gray-600">Orders you start preparing will appear here.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {preparingOrders.map((order) => (
                      <Card key={order.id} className="border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">Table {order.tableId}</Badge>
                              <Badge variant="secondary">#{order.id.slice(-4)}</Badge>
                            </div>
                            <OrderStatusBadge status={order.status} />
                          </div>
                          <div className="text-sm space-y-1 mb-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>{item.name} x{item.quantity}</span>
                                <span>₹{(item.displayPrice || item.price) * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Started: {order.timestamp.toLocaleTimeString()}
                            </span>
                            <Button 
                              onClick={() => handleStatusUpdate(order.id, 'ready')}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Mark Ready
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ready Orders Tab */}
          <TabsContent value="ready" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Ready for Pickup</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {readyOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Ready</h3>
                    <p className="text-gray-600">Completed orders will appear here.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {readyOrders.map((order) => (
                      <Card key={order.id} className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">Table {order.tableId}</Badge>
                              <Badge variant="secondary">#{order.id.slice(-4)}</Badge>
                            </div>
                            <OrderStatusBadge status={order.status} />
                          </div>
                          <div className="text-sm space-y-1 mb-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>{item.name} x{item.quantity}</span>
                                <span>₹{(item.displayPrice || item.price) * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Ready: {order.timestamp.toLocaleTimeString()}
                            </span>
                            <Button 
                              onClick={() => handleStatusUpdate(order.id, 'completed')}
                              size="sm"
                              variant="outline"
                            >
                              Mark Delivered
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Kitchen Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Kitchen Name</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {kitchenUser.kitchenName}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    {kitchenUser.username}
                  </p>
                </div>

                {kitchenUser.contactNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      +91 {kitchenUser.contactNumber}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700">Restaurant ID</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    {kitchenUser.restaurantId}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={kitchenUser.isActive ? "default" : "destructive"}>
                      {kitchenUser.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Kitchen Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">🍳 Kitchen Display System</h4>
                  <p className="text-green-700 text-sm">
                    This is your kitchen display dashboard where you can view and manage incoming orders in real-time.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Order Flow:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>New Orders:</strong> Appear in "Live Orders" - click "Start Preparing"</li>
                    <li>• <strong>Preparing:</strong> Orders you're currently working on</li>
                    <li>• <strong>Ready:</strong> Completed orders waiting for pickup</li>
                    <li>• <strong>Delivered:</strong> Orders marked as delivered to customers</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">📱 Real-time Updates</h4>
                  <p className="text-blue-700 text-sm">
                    Orders will automatically appear here when customers place them through the QR ordering system.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Kitchen;
