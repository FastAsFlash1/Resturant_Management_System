import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { useRestaurant, MenuItem } from '@/contexts/RestaurantContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LayoutDashboard,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Save,
  X,
  Search,
  Filter,
  Eye,
  EyeOff,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  
  const { orders, menu, addMenuItem, deleteMenuItem, updateMenuItem } = useRestaurant();

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    available: true,
  });

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    available: true,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      toast.success('Welcome to Admin Dashboard!');
    } else {
      toast.error('Invalid credentials. Try admin/admin123');
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price || !newItem.category) {
      toast.error('Please fill all required fields');
      return;
    }

    addMenuItem({
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      category: newItem.category,
      image: newItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      available: newItem.available,
    });

    toast.success('Menu item added successfully!');
    setNewItem({ name: '', description: '', price: '', category: '', image: '', available: true });
    setIsAddingItem(false);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      available: item.available,
    });
  };

  const handleUpdateItem = () => {
    if (!editingItem || !editForm.name || !editForm.price || !editForm.category) {
      toast.error('Please fill all required fields');
      return;
    }

    updateMenuItem(editingItem.id, {
      name: editForm.name,
      description: editForm.description,
      price: parseFloat(editForm.price),
      category: editForm.category,
      image: editForm.image,
      available: editForm.available,
    });

    toast.success('Menu item updated successfully!');
    setEditingItem(null);
  };

  const handleQuickPriceUpdate = (itemId: string, newPrice: number) => {
    updateMenuItem(itemId, { price: newPrice });
    toast.success('Price updated successfully!');
  };

  const handleToggleAvailability = (itemId: string, available: boolean) => {
    updateMenuItem(itemId, { available });
    toast.success(`Item ${available ? 'enabled' : 'disabled'} successfully!`);
  };

  const categories = Array.from(new Set(menu.map(item => item.category)));
  
  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesAvailability = filterAvailability === 'all' || 
                               (filterAvailability === 'available' && item.available) ||
                               (filterAvailability === 'unavailable' && !item.available);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-hover">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
              <LayoutDashboard className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Login
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Demo: admin / admin123
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="sticky top-0 z-40 bg-card border-b shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                {user && (
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {user.ownerName}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Menu
              </Button>
              
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user.ownerName}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="flex items-center gap-2 text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">₹{totalRevenue}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Order
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                ₹{averageOrder.toFixed(0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-8">
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="shadow-card animate-slide-up">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>
                          Table {order.tableId} - Order #{order.id.slice(-4)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {order.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-sm text-muted-foreground">
                        Payment: {order.paymentType}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        ₹{order.total}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="menu" className="mt-8">
            {/* Menu Management Header */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Menu Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Menu Item</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input
                              value={newItem.name}
                              onChange={(e) =>
                                setNewItem({ ...newItem, name: e.target.value })
                              }
                              placeholder="Item name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={newItem.description}
                              onChange={(e) =>
                                setNewItem({ ...newItem, description: e.target.value })
                              }
                              placeholder="Item description"
                              className="min-h-[100px]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Price *</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={newItem.price}
                              onChange={(e) =>
                                setNewItem({ ...newItem, price: e.target.value })
                              }
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Category *</Label>
                            <Select
                              value={newItem.category}
                              onValueChange={(value) =>
                                setNewItem({ ...newItem, category: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select or type category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              value={newItem.category}
                              onChange={(e) =>
                                setNewItem({ ...newItem, category: e.target.value })
                              }
                              placeholder="Or type new category"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input
                              value={newItem.image}
                              onChange={(e) =>
                                setNewItem({ ...newItem, image: e.target.value })
                              }
                              placeholder="https://..."
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="available"
                              checked={newItem.available}
                              onCheckedChange={(checked) =>
                                setNewItem({ ...newItem, available: checked })
                              }
                            />
                            <Label htmlFor="available">Available</Label>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-6">
                        <Button onClick={handleAddItem} className="flex-1">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddingItem(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Total: {menu.length} items</span>
                  <span>•</span>
                  <span>Available: {menu.filter(i => i.available).length}</span>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterAvailability} onValueChange={setFilterAvailability}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="available">Available Only</SelectItem>
                    <SelectItem value="unavailable">Unavailable Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenu.map((item) => (
                <Card key={item.id} className={`shadow-card transition-all ${!item.available ? 'opacity-75 border-muted' : ''}`}>
                  <div className="aspect-video w-full overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {!item.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Unavailable
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                        <Badge variant="secondary" className="mb-2">
                          {item.category}
                        </Badge>
                      </div>
                      <Switch
                        checked={item.available}
                        onCheckedChange={(checked) => handleToggleAvailability(item.id, checked)}
                        size="sm"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    
                    {/* Quick Price Edit */}
                    <div className="mb-4">
                      <Label className="text-xs text-muted-foreground">Price</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          defaultValue={item.price}
                          className="text-lg font-bold"
                          onBlur={(e) => {
                            const newPrice = parseFloat(e.target.value);
                            if (newPrice !== item.price && newPrice > 0) {
                              handleQuickPriceUpdate(item.id, newPrice);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const newPrice = parseFloat(e.currentTarget.value);
                              if (newPrice !== item.price && newPrice > 0) {
                                handleQuickPriceUpdate(item.id, newPrice);
                              }
                            }
                          }}
                        />
                        <span className="text-sm text-muted-foreground">₹</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                deleteMenuItem(item.id);
                                toast.success('Item deleted successfully!');
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMenu.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-lg font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterCategory !== 'all' || filterAvailability !== 'all'
                    ? "Try adjusting your search or filters"
                    : "Add your first menu item to get started"}
                </p>
              </div>
            )}

            {/* Edit Item Dialog */}
            <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Menu Item</DialogTitle>
                </DialogHeader>
                {editingItem && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="Item name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                          placeholder="Item description"
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm({ ...editForm, price: e.target.value })
                          }
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select
                          value={editForm.category}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({ ...editForm, category: e.target.value })
                          }
                          placeholder="Or type new category"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          value={editForm.image}
                          onChange={(e) =>
                            setEditForm({ ...editForm, image: e.target.value })
                          }
                          placeholder="https://..."
                        />
                        {editForm.image && (
                          <div className="aspect-video w-full max-w-48 overflow-hidden rounded border">
                            <img
                              src={editForm.image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="edit-available"
                          checked={editForm.available}
                          onCheckedChange={(checked) =>
                            setEditForm({ ...editForm, available: checked })
                          }
                        />
                        <Label htmlFor="edit-available">Available</Label>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-6">
                  <Button onClick={handleUpdateItem} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Update Item
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingItem(null)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
