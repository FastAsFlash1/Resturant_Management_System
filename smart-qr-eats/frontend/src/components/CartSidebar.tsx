import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useState } from 'react';
import { PaymentDialog } from './PaymentDialog';

export const CartSidebar = ({ tableId }: { tableId: string }) => {
  const { cart, removeFromCart, updateQuantity } = useRestaurant();
  const [open, setOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const total = cart.reduce((sum, item) => {
    const itemPrice = item.displayPrice || item.price;
    return sum + itemPrice * item.quantity;
  }, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 h-14 px-6 rounded-full shadow-hover z-50"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Cart
            {itemCount > 0 && (
              <Badge className="ml-2 bg-primary-foreground text-primary">
                {itemCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-2xl">Your Cart</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4 flex-1 overflow-y-auto max-h-[60vh]">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              cart.map((item, index) => {
                const itemPrice = item.displayPrice || item.price;
                const isCustomized = !!item.customization;
                
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex gap-4 p-4 border rounded-lg animate-slide-up"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{item.name}</h4>
                        {isCustomized && (
                          <Badge variant="secondary" className="text-xs">
                            Customized
                          </Badge>
                        )}
                      </div>
                      
                      {isCustomized && item.customization && (
                        <div className="text-xs text-muted-foreground mt-1 space-y-1">
                          <p>
                            <span className="font-medium">Size:</span> {item.customization.portionSize.name}
                          </p>
                          {Object.entries(item.customization.customizations).map(([key, value]) => (
                            <p key={key}>
                              <span className="font-medium capitalize">{key.replace('-', ' ')}:</span>{' '}
                              {Array.isArray(value) ? value.join(', ') : value}
                            </p>
                          ))}
                          {item.customization.specialInstructions && (
                            <p>
                              <span className="font-medium">Note:</span> {item.customization.specialInstructions}
                            </p>
                          )}
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground mt-1">₹{itemPrice}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{itemPrice * item.quantity}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2"
                        onClick={() => removeFromCart(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {cart.length > 0 && (
            <div className="mt-6 space-y-4 border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  setOpen(false);
                  setShowPayment(true);
                }}
              >
                Proceed to Payment
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        tableId={tableId}
        total={total}
      />
    </>
  );
};
