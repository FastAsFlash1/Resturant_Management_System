import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Banknote, Smartphone, CreditCard, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableId: string;
  total: number;
}

export const PaymentDialog = ({ open, onOpenChange, tableId, total }: PaymentDialogProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'upi' | 'razorpay' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { placeOrder } = useRestaurant();
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    placeOrder(tableId, selectedMethod);
    setIsProcessing(false);
    setIsSuccess(true);

    toast.success('Order placed successfully!');

    // Reset after 2 seconds and navigate to order tracking
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedMethod(null);
      onOpenChange(false);
      navigate(`/?table=${tableId}`);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8 space-y-4 animate-scale-in">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-2xl font-bold">Order Placed Successfully!</h3>
            <p className="text-muted-foreground">
              Your order is being prepared. You can track the status on the main screen.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose Payment Method</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-primary">₹{total}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Card
              className={`cursor-pointer transition-all ${
                selectedMethod === 'cash'
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedMethod('cash')}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Banknote className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Cash on Delivery</h4>
                  <p className="text-sm text-muted-foreground">Pay to waiter</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${
                selectedMethod === 'upi'
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedMethod('upi')}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">UPI Payment</h4>
                  <p className="text-sm text-muted-foreground">PhonePe, GPay, Paytm</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${
                selectedMethod === 'razorpay'
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedMethod('razorpay')}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Card Payment</h4>
                  <p className="text-sm text-muted-foreground">Credit/Debit Card</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!selectedMethod || isProcessing}
            onClick={handlePayment}
          >
            {isProcessing ? 'Processing...' : `Pay ₹${total}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
