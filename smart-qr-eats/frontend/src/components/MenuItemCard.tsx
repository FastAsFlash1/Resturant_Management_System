import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Settings } from 'lucide-react';
import { MenuItem, MenuItemCustomization } from '@/contexts/RestaurantContext';
import { CustomizationDialog } from './CustomizationDialog';
import { useState } from 'react';

interface MenuItemCardProps {
  item: MenuItem;
  quantity?: number;
  onAdd: () => void;
  onRemove?: () => void;
  onCustomize?: (customization: MenuItemCustomization) => void;
}

export const MenuItemCard = ({ item, quantity = 0, onAdd, onRemove, onCustomize }: MenuItemCardProps) => {
  const [customizeQuantity, setCustomizeQuantity] = useState(1);

  const handleCustomize = (customization: MenuItemCustomization) => {
    if (onCustomize && item.available) {
      // Add customized item multiple times based on quantity
      for (let i = 0; i < customizeQuantity; i++) {
        onCustomize(customization);
      }
      setCustomizeQuantity(1); // Reset quantity
    }
  };

  const isAvailable = item.available;

  return (
    <Card className={`overflow-hidden transition-all duration-300 animate-scale-in ${
      isAvailable ? 'hover:shadow-hover' : 'opacity-75 grayscale'
    }`}>
      <div className="aspect-video w-full overflow-hidden relative">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isAvailable ? 'hover:scale-110' : ''
          }`}
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm font-semibold">
              Currently Unavailable
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              {!isAvailable && (
                <Badge variant="outline" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
            <Badge variant="secondary" className="mb-2">
              {item.category}
            </Badge>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary">₹{item.price}</span>
            <span className="text-xs text-muted-foreground">Starting from</span>
          </div>
          <div className="flex flex-col gap-2">
            {isAvailable ? (
              <>
                {quantity > 0 ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 rounded-full p-0"
                      onClick={onRemove}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold min-w-[2ch] text-center">{quantity}</span>
                    <Button
                      size="sm"
                      className="h-8 w-8 rounded-full p-0"
                      onClick={onAdd}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={onAdd} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Quick Add
                  </Button>
                )}
                
                {onCustomize && (
                  <CustomizationDialog
                    item={item}
                    quantity={customizeQuantity}
                    onCustomize={handleCustomize}
                    onQuantityChange={setCustomizeQuantity}
                  >
                    <Button size="sm" className="w-full">
                      <Settings className="h-4 w-4 mr-1" />
                      Customize
                    </Button>
                  </CustomizationDialog>
                )}
              </>
            ) : (
              <Button size="sm" className="w-full" disabled variant="outline">
                Unavailable
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
