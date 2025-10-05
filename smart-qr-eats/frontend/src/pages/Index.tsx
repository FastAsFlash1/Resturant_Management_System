import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MenuItemCard } from '@/components/MenuItemCard';
import { CartSidebar } from '@/components/CartSidebar';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRestaurant, MenuItemCustomization } from '@/contexts/RestaurantContext';
import { UtensilsCrossed, ChefHat, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('table') || '5';
  const { menu, orders, cart, addToCart, removeFromCart } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const availableMenu = menu.filter((item) => item.available);
  const categories = ['All', ...Array.from(new Set(availableMenu.map((item) => item.category)))];
  const filteredMenu = selectedCategory === 'All'
    ? availableMenu
    : availableMenu.filter((item) => item.category === selectedCategory);

  const tableOrders = orders.filter((order) => order.tableId === tableId);

  const handleCustomizeItem = (item: any, customization: MenuItemCustomization) => {
    addToCart(item, customization);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">QR Restaurant</h1>
                <Badge variant="secondary">Table {tableId}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/kitchen">
                  <ChefHat className="h-4 w-4 mr-2" />
                  Kitchen
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-24">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="orders">
              My Orders
              {tableOrders.length > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {tableOrders.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="mt-8">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Menu Grid */}
            {filteredMenu.length === 0 ? (
              <Card className="max-w-md mx-auto">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <UtensilsCrossed className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No items available</h3>
                  <p>
                    {selectedCategory === 'All' 
                      ? 'All menu items are currently unavailable. Please check back later.'
                      : `No items available in ${selectedCategory} category. Try browsing other categories.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenu.map((item) => {
                  const cartItemsIndices = cart
                    .map((c, index) => ({ item: c, index }))
                    .filter(({ item: c }) => c.id === item.id && !c.customization);
                  const totalQuantity = cartItemsIndices.reduce((sum, { item }) => sum + item.quantity, 0);
                  
                  return (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      quantity={totalQuantity}
                      onAdd={() => addToCart(item)}
                      onRemove={() => {
                        const firstCartItem = cartItemsIndices[0];
                        if (firstCartItem) removeFromCart(firstCartItem.index);
                      }}
                      onCustomize={(customization) => handleCustomizeItem(item, customization)}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="mt-8">
            <div className="space-y-4 max-w-4xl mx-auto">
              {tableOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <UtensilsCrossed className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No orders yet. Browse the menu and place your first order!</p>
                  </CardContent>
                </Card>
              ) : (
                tableOrders.map((order) => (
                  <Card key={order.id} className="animate-slide-up shadow-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Order #{order.id.slice(-4)}</CardTitle>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.timestamp.toLocaleTimeString()}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, itemIndex) => {
                          const itemPrice = item.displayPrice || item.price;
                          const isCustomized = !!item.customization;
                          
                          return (
                            <div key={`${item.id}-${itemIndex}`} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span>{item.name} x {item.quantity}</span>
                                    {isCustomized && (
                                      <Badge variant="outline" className="text-xs">
                                        Customized
                                      </Badge>
                                    )}
                                  </div>
                                  {isCustomized && item.customization && (
                                    <div className="text-xs text-muted-foreground mt-1 pl-2">
                                      <div>Size: {item.customization.portionSize.name}</div>
                                      {Object.entries(item.customization.customizations).map(([key, value]) => (
                                        <div key={key}>
                                          {key.replace('-', ' ')}: {Array.isArray(value) ? value.join(', ') : value}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <span className="font-medium">
                                  ₹{itemPrice * item.quantity}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div>
                          <Badge variant="outline">{order.paymentType}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-xl font-bold text-primary">
                            ₹{order.total}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <CartSidebar tableId={tableId} />
    </div>
  );
};

export default Index;
