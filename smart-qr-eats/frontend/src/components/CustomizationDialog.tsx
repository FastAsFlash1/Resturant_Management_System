import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Settings } from 'lucide-react';
import { MenuItem } from '@/contexts/RestaurantContext';

export interface CustomizationOption {
  id: string;
  name: string;
  type: 'radio' | 'checkbox' | 'text';
  required?: boolean;
  choices?: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface PortionSize {
  id: string;
  name: string;
  multiplier: number;
  description?: string;
}

export interface MenuItemCustomization {
  itemId: string;
  portionSize: PortionSize;
  customizations: Record<string, string | string[]>;
  specialInstructions?: string;
  totalPrice: number;
}

interface CustomizationDialogProps {
  item: MenuItem;
  quantity: number;
  onCustomize: (customization: MenuItemCustomization) => void;
  onQuantityChange: (quantity: number) => void;
  children: React.ReactNode;
}

// Default portion sizes for different categories
const getPortionSizesForCategory = (category: string): PortionSize[] => {
  const basePortions: PortionSize[] = [
    { id: 'regular', name: 'Regular', multiplier: 1, description: 'Standard serving size' },
    { id: 'large', name: 'Large', multiplier: 1.5, description: '50% more than regular' },
  ];

  const categorySpecific: Record<string, PortionSize[]> = {
    'Pizza': [
      { id: 'small', name: 'Small (8")', multiplier: 0.75, description: 'Perfect for 1 person' },
      { id: 'medium', name: 'Medium (12")', multiplier: 1, description: 'Good for 2-3 people' },
      { id: 'large', name: 'Large (16")', multiplier: 1.5, description: 'Great for 3-4 people' },
      { id: 'xl', name: 'Extra Large (20")', multiplier: 2, description: 'Perfect for groups' },
    ],
    'Main Course': [
      { id: 'half', name: 'Half Portion', multiplier: 0.6, description: 'Smaller appetite' },
      ...basePortions,
      { id: 'family', name: 'Family Size', multiplier: 2.5, description: 'Serves 3-4 people' },
    ],
    'Desserts': [
      { id: 'mini', name: 'Mini', multiplier: 0.5, description: 'Just a taste' },
      ...basePortions,
    ],
    'Starters': basePortions,
    'Salads': basePortions,
  };

  return categorySpecific[category] || basePortions;
};

// Default customization options for different categories
const getCustomizationOptions = (category: string): CustomizationOption[] => {
  const commonOptions: CustomizationOption[] = [
    {
      id: 'spice-level',
      name: 'Spice Level',
      type: 'radio',
      choices: [
        { id: 'mild', name: 'Mild', price: 0 },
        { id: 'medium', name: 'Medium', price: 0 },
        { id: 'hot', name: 'Hot', price: 0 },
        { id: 'extra-hot', name: 'Extra Hot', price: 0 },
      ],
    },
  ];

  const categorySpecific: Record<string, CustomizationOption[]> = {
    'Pizza': [
      {
        id: 'crust',
        name: 'Crust Type',
        type: 'radio',
        required: true,
        choices: [
          { id: 'thin', name: 'Thin Crust', price: 0 },
          { id: 'thick', name: 'Thick Crust', price: 20 },
          { id: 'stuffed', name: 'Cheese Stuffed', price: 50 },
        ],
      },
      {
        id: 'toppings',
        name: 'Extra Toppings',
        type: 'checkbox',
        choices: [
          { id: 'cheese', name: 'Extra Cheese', price: 30 },
          { id: 'mushroom', name: 'Mushrooms', price: 25 },
          { id: 'olives', name: 'Olives', price: 20 },
          { id: 'bell-pepper', name: 'Bell Peppers', price: 15 },
          { id: 'onions', name: 'Onions', price: 10 },
        ],
      },
      ...commonOptions,
    ],
    'Main Course': [
      {
        id: 'rice-choice',
        name: 'Rice Option',
        type: 'radio',
        choices: [
          { id: 'basmati', name: 'Basmati Rice', price: 0 },
          { id: 'brown', name: 'Brown Rice', price: 15 },
          { id: 'jeera', name: 'Jeera Rice', price: 20 },
          { id: 'no-rice', name: 'No Rice', price: -30 },
        ],
      },
      {
        id: 'sides',
        name: 'Add Sides',
        type: 'checkbox',
        choices: [
          { id: 'raita', name: 'Raita', price: 25 },
          { id: 'pickle', name: 'Pickle', price: 15 },
          { id: 'papad', name: 'Papad', price: 20 },
        ],
      },
      ...commonOptions,
    ],
    'Salads': [
      {
        id: 'dressing',
        name: 'Dressing',
        type: 'radio',
        required: true,
        choices: [
          { id: 'caesar', name: 'Caesar Dressing', price: 0 },
          { id: 'italian', name: 'Italian Dressing', price: 0 },
          { id: 'balsamic', name: 'Balsamic Vinaigrette', price: 5 },
          { id: 'on-side', name: 'Dressing on Side', price: 0 },
        ],
      },
      {
        id: 'add-ons',
        name: 'Add-ons',
        type: 'checkbox',
        choices: [
          { id: 'grilled-chicken', name: 'Grilled Chicken', price: 80 },
          { id: 'paneer', name: 'Paneer', price: 60 },
          { id: 'extra-veggies', name: 'Extra Vegetables', price: 30 },
        ],
      },
    ],
    'Starters': [
      {
        id: 'preparation',
        name: 'Preparation Style',
        type: 'radio',
        choices: [
          { id: 'grilled', name: 'Grilled', price: 0 },
          { id: 'fried', name: 'Deep Fried', price: 10 },
          { id: 'tandoor', name: 'Tandoor', price: 20 },
        ],
      },
      ...commonOptions,
    ],
    'Desserts': [
      {
        id: 'temperature',
        name: 'Serving Temperature',
        type: 'radio',
        choices: [
          { id: 'room', name: 'Room Temperature', price: 0 },
          { id: 'warm', name: 'Warm', price: 0 },
          { id: 'cold', name: 'Chilled', price: 0 },
        ],
      },
      {
        id: 'extras',
        name: 'Extras',
        type: 'checkbox',
        choices: [
          { id: 'ice-cream', name: 'Vanilla Ice Cream', price: 30 },
          { id: 'whipped-cream', name: 'Whipped Cream', price: 20 },
          { id: 'nuts', name: 'Mixed Nuts', price: 25 },
        ],
      },
    ],
  };

  return categorySpecific[category] || commonOptions;
};

export const CustomizationDialog: React.FC<CustomizationDialogProps> = ({
  item,
  quantity,
  onCustomize,
  onQuantityChange,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPortion, setSelectedPortion] = useState<PortionSize>(
    getPortionSizesForCategory(item.category)[0]
  );
  const [customizations, setCustomizations] = useState<Record<string, string | string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Check if item is available
  if (!item.available) {
    return (
      <div className="opacity-50 cursor-not-allowed">
        {children}
      </div>
    );
  }

  const portionSizes = getPortionSizesForCategory(item.category);
  const customizationOptions = getCustomizationOptions(item.category);

  const calculateTotalPrice = () => {
    let basePrice = item.price * selectedPortion.multiplier;
    
    customizationOptions.forEach((option) => {
      if (option.choices) {
        const selectedValue = customizations[option.id];
        if (option.type === 'radio' && typeof selectedValue === 'string') {
          const choice = option.choices.find(c => c.id === selectedValue);
          if (choice) basePrice += choice.price;
        } else if (option.type === 'checkbox' && Array.isArray(selectedValue)) {
          selectedValue.forEach(choiceId => {
            const choice = option.choices!.find(c => c.id === choiceId);
            if (choice) basePrice += choice.price;
          });
        }
      }
    });

    return Math.round(basePrice);
  };

  const handleCustomizationChange = (optionId: string, value: string | string[]) => {
    setCustomizations(prev => ({
      ...prev,
      [optionId]: value,
    }));
  };

  const handleAddToCart = () => {
    const customization: MenuItemCustomization = {
      itemId: item.id,
      portionSize: selectedPortion,
      customizations,
      specialInstructions: specialInstructions.trim() || undefined,
      totalPrice: calculateTotalPrice(),
    };

    onCustomize(customization);
    setIsOpen(false);
  };

  const totalPrice = calculateTotalPrice();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Customize {item.name}
          </DialogTitle>
          <DialogDescription>
            Customize your order to your preference
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {item.category}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portion Size Selection */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              Portion Size
              <Badge variant="outline">Required</Badge>
            </h4>
            <RadioGroup
              value={selectedPortion.id}
              onValueChange={(value) => {
                const portion = portionSizes.find(p => p.id === value);
                if (portion) setSelectedPortion(portion);
              }}
              className="grid grid-cols-1 gap-3"
            >
              {portionSizes.map((portion) => (
                <div key={portion.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={portion.id} id={portion.id} />
                  <Label htmlFor={portion.id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{portion.name}</span>
                        {portion.description && (
                          <p className="text-sm text-muted-foreground">
                            {portion.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">
                          ₹{Math.round(item.price * portion.multiplier)}
                        </span>
                        {portion.multiplier !== 1 && (
                          <p className="text-xs text-muted-foreground">
                            {portion.multiplier > 1 ? '+' : ''}
                            {Math.round((portion.multiplier - 1) * 100)}%
                          </p>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Customization Options */}
          {customizationOptions.map((option) => (
            <div key={option.id} className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                {option.name}
                {option.required && <Badge variant="outline">Required</Badge>}
              </h4>

              {option.type === 'radio' && option.choices && (
                <RadioGroup
                  value={customizations[option.id] as string || ''}
                  onValueChange={(value) => handleCustomizationChange(option.id, value)}
                  className="grid grid-cols-1 gap-3"
                >
                  {option.choices.map((choice) => (
                    <div key={choice.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={choice.id} id={`${option.id}-${choice.id}`} />
                      <Label
                        htmlFor={`${option.id}-${choice.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <span>{choice.name}</span>
                          {choice.price > 0 && (
                            <span className="text-sm font-medium">+₹{choice.price}</span>
                          )}
                          {choice.price < 0 && (
                            <span className="text-sm font-medium text-green-600">
                              -₹{Math.abs(choice.price)}
                            </span>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {option.type === 'checkbox' && option.choices && (
                <div className="grid grid-cols-1 gap-3">
                  {option.choices.map((choice) => (
                    <div key={choice.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${option.id}-${choice.id}`}
                        checked={(customizations[option.id] as string[] || []).includes(choice.id)}
                        onCheckedChange={(checked) => {
                          const currentValues = (customizations[option.id] as string[]) || [];
                          if (checked) {
                            handleCustomizationChange(option.id, [...currentValues, choice.id]);
                          } else {
                            handleCustomizationChange(
                              option.id,
                              currentValues.filter(v => v !== choice.id)
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={`${option.id}-${choice.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <span>{choice.name}</span>
                          {choice.price > 0 && (
                            <span className="text-sm font-medium">+₹{choice.price}</span>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              <Separator />
            </div>
          ))}

          {/* Special Instructions */}
          <div className="space-y-4">
            <h4 className="font-semibold">Special Instructions</h4>
            <Textarea
              placeholder="Any special requests or dietary requirements..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 rounded-full p-0"
                  onClick={() => quantity > 1 && onQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold min-w-[2ch] text-center">{quantity}</span>
                <Button
                  size="sm"
                  className="h-8 w-8 rounded-full p-0"
                  onClick={() => onQuantityChange(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="text-xl font-bold text-primary">
                ₹{totalPrice * quantity}
              </p>
            </div>
          </div>

          <Button onClick={handleAddToCart} className="w-full" size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Add to Cart - ₹{totalPrice * quantity}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};