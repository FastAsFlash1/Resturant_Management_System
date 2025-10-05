import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, CheckCircle2 } from 'lucide-react';
import { Order } from '@/contexts/RestaurantContext';

interface OrderStatusBadgeProps {
  status: Order['status'];
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: Clock,
      variant: 'secondary' as const,
      className: 'bg-secondary text-secondary-foreground',
    },
    preparing: {
      label: 'Preparing',
      icon: ChefHat,
      variant: 'default' as const,
      className: 'bg-primary text-primary-foreground',
    },
    served: {
      label: 'Served',
      icon: CheckCircle2,
      variant: 'default' as const,
      className: 'bg-accent text-accent-foreground',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
};
