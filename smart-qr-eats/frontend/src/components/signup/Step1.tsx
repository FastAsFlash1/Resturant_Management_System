import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Building2,
  User,
  MapPin,
  Calendar
} from 'lucide-react';
import { useSignup } from '@/contexts/SignupContext';

const Step1: React.FC = () => {
  const { signupData, updateSignupData, setCurrentStep } = useSignup();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (!signupData.restaurantName.trim()) {
      newErrors.restaurantName = 'Restaurant name is required';
    }

    if (!signupData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (!signupData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!signupData.establishmentYear.trim()) {
      newErrors.establishmentYear = 'Establishment year is required';
    } else {
      const year = parseInt(signupData.establishmentYear);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        newErrors.establishmentYear = 'Please enter a valid year';
      }
    }

    if (!signupData.document) {
      newErrors.document = 'Document upload is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(2);
    }
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, document: 'Please upload PDF or image file only' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, document: 'File size must be less than 5MB' }));
        return;
      }
      updateSignupData({ document: file });
      setErrors(prev => ({ ...prev, document: '' }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Restaurant & Owner Details</CardTitle>
        </div>
        <p className="text-muted-foreground">
          Let's get started with your restaurant information
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="restaurantName" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Restaurant Name *
            </Label>
            <Input
              id="restaurantName"
              placeholder="e.g., Spice Garden Restaurant"
              value={signupData.restaurantName}
              onChange={(e) => updateSignupData({ restaurantName: e.target.value })}
              className={errors.restaurantName ? 'border-red-500' : ''}
            />
            {errors.restaurantName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.restaurantName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Owner Name *
            </Label>
            <Input
              id="ownerName"
              placeholder="e.g., Raj Patel"
              value={signupData.ownerName}
              onChange={(e) => updateSignupData({ ownerName: e.target.value })}
              className={errors.ownerName ? 'border-red-500' : ''}
            />
            {errors.ownerName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.ownerName}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location / City *
            </Label>
            <Input
              id="location"
              placeholder="e.g., Mumbai, Maharashtra"
              value={signupData.location}
              onChange={(e) => updateSignupData({ location: e.target.value })}
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.location}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="establishmentYear" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Establishment Year *
            </Label>
            <Input
              id="establishmentYear"
              type="number"
              placeholder="e.g., 2018"
              min="1900"
              max={new Date().getFullYear()}
              value={signupData.establishmentYear}
              onChange={(e) => updateSignupData({ establishmentYear: e.target.value })}
              className={errors.establishmentYear ? 'border-red-500' : ''}
            />
            {errors.establishmentYear && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.establishmentYear}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Document Upload *
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Upload business license, registration certificate, or owner ID verification
          </p>
          
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
              ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${errors.document ? 'border-red-500' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
            
            {signupData.document ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-6 w-6" />
                <span className="font-medium">{signupData.document.name}</span>
                <Badge variant="secondary">
                  {(signupData.document.size / 1024 / 1024).toFixed(2)} MB
                </Badge>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <div>
                  <p className="font-medium">Drop your file here or click to browse</p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, JPG, PNG (max 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {errors.document && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.document}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleNext} size="lg" className="px-8">
            Next Step
            <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step1;