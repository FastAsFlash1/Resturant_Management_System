import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { ChefHat, ArrowLeft, UtensilsCrossed, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const Kitchen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { orders, updateOrderStatus, menu, updateMenuItem } = useRestaurant();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'chef' && password === 'kitchen123') {
      setIsLoggedIn(true);
      toast.success('Welcome to Kitchen Dashboard!');
    } else {
      toast.error('Invalid credentials. Try chef/kitchen123');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-hover">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
              <ChefHat className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl">Kitchen Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="chef"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="kitchen123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Login
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Demo: chef / kitchen123
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.tableId]) {
      acc[order.tableId] = [];
    }
    acc[order.tableId].push(order);
    return acc;
  }, {} as Record<string, typeof orders>);

  const handleAvailabilityToggle = (itemId: string, available: boolean) => {
    updateMenuItem(itemId, { available });
    toast.success(
      available 
        ? 'Item marked as available' 
        : 'Item marked as unavailable'
    );
  };

  const getAvailabilityStats = () => {
    const total = menu.length;
    const available = menu.filter(item => item.available).length;
    const unavailable = total - available;
    
    return { total, available, unavailable };
  };

  const stats = getAvailabilityStats();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="sticky top-0 z-40 bg-card border-b shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Orders
              {orders.filter(order => order.status !== 'served').length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {orders.filter(order => order.status !== 'served').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Menu Control
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            {orders.length === 0 ? (
              <Card className="max-w-md mx-auto">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <ChefHat className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No orders yet. Waiting for customers...</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(groupedOrders).map(([tableId, tableOrders]) =>
                  tableOrders.map((order) => (
                    <Card key={order.id} className="animate-slide-up shadow-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Table {tableId}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              Order #{order.id.slice(-4)}
                            </p>
                          </div>
                          <OrderStatusBadge status={order.status} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {order.items.map((item, itemIndex) => {
                            const isCustomized = !!item.customization;
                            
                            return (
                              <div
                                key={`${item.id}-${itemIndex}`}
                                className="p-3 bg-muted rounded-lg space-y-2"
                              >
                                <div className="flex justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium">{item.name}</p>
                                      {isCustomized && (
                                        <Badge variant="secondary" className="text-xs">
                                          Custom
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Quantity: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                
                                {isCustomized && item.customization && (
                                  <div className="text-xs text-muted-foreground bg-background/50 p-2 rounded border-l-2 border-primary/20">
                                    <div className="font-medium mb-1">Customizations:</div>
                                    <div>Size: {item.customization.portionSize.name}</div>
                                    {Object.entries(item.customization.customizations).map(([key, value]) => (
                                      <div key={key}>
                                        {key.replace('-', ' ')}: {Array.isArray(value) ? value.join(', ') : value}
                                      </div>
                                    ))}
                                    {item.customization.specialInstructions && (
                                      <div className="mt-1 font-medium">
                                        Note: {item.customization.specialInstructions}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <Button
                              className="flex-1"
                              onClick={() => {
                                updateOrderStatus(order.id, 'preparing');
                                toast.success('Order moved to Preparing');
                              }}
                            >
                              Start Preparing
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button
                              className="flex-1"
                              variant="default"
                              onClick={() => {
                                updateOrderStatus(order.id, 'served');
                                toast.success('Order marked as Served');
                              }}
                            >
                              Mark as Served
                            </Button>
                          )}
                          {order.status === 'served' && (
                            <Button className="flex-1" disabled>
                              Completed
                            </Button>
                          )}
                        </div>

                        <div className="pt-2 border-t text-sm text-muted-foreground">
                          <p>{order.timestamp.toLocaleString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="menu">
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Total Items
                        </p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                      <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Available
                        </p>
                        <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Unavailable
                        </p>
                        <p className="text-2xl font-bold text-red-600">{stats.unavailable}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-4 mb-6">
                <Button
                  onClick={() => {
                    menu.forEach(item => {
                      if (!item.available) {
                        updateMenuItem(item.id, { available: true });
                      }
                    });
                    toast.success('All items marked as available');
                  }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark All Available
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    menu.forEach(item => {
                      if (item.available) {
                        updateMenuItem(item.id, { available: false });
                      }
                    });
                    toast.success('All items marked as unavailable');
                  }}
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Mark All Unavailable
                </Button>
              </div>

              {/* Menu Items Control */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5" />
                    Menu Items Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Group by category */}
                    {Array.from(new Set(menu.map(item => item.category))).map(category => {
                      const categoryItems = menu.filter(item => item.category === category);
                      const availableCount = categoryItems.filter(item => item.available).length;
                      const totalCount = categoryItems.length;
                      
                      return (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{category}</h3>
                              <Badge variant="outline">
                                {availableCount}/{totalCount} available
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  categoryItems.forEach(item => {
                                    if (!item.available) {
                                      updateMenuItem(item.id, { available: true });
                                    }
                                  });
                                  toast.success(`All ${category} items marked as available`);
                                }}
                                className="text-xs"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Enable All
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  categoryItems.forEach(item => {
                                    if (item.available) {
                                      updateMenuItem(item.id, { available: false });
                                    }
                                  });
                                  toast.success(`All ${category} items marked as unavailable`);
                                }}
                                className="text-xs"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Disable All
                              </Button>
                            </div>
                          </div>
                          <div className="grid gap-3">
                          {menu
                            .filter(item => item.category === category)
                            .map(item => (
                              <div 
                                key={item.id}
                                className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow"
                              >
                                <div className="flex items-center gap-4">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium text-lg">{item.name}</h4>
                                      <Badge 
                                        variant={item.available ? "default" : "destructive"}
                                        className="text-xs"
                                      >
                                        {item.available ? "Available" : "Unavailable"}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                      {item.description}
                                    </p>
                                    <p className="text-sm font-medium text-primary mt-1">
                                      ₹{item.price}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <Label 
                                    htmlFor={`availability-${item.id}`} 
                                    className="text-sm font-medium"
                                  >
                                    {item.available ? "Available" : "Unavailable"}
                                  </Label>
                                  <Switch
                                    id={`availability-${item.id}`}
                                    checked={item.available}
                                    onCheckedChange={(checked) => 
                                      handleAvailabilityToggle(item.id, checked)
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Kitchen;
