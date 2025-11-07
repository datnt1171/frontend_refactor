'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import type { UserDetail, Trip } from '@/types';
import { createTrip } from '@/lib/api/client/fleet';
import { useRouter } from '@/i18n/navigation';

interface CreateTripFormProps {
  currentUser: UserDetail;
  carOptions: Array<{ value: string; label: string }>;
}

export default function CreateTripForm({ currentUser, carOptions }: CreateTripFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const router = useRouter()
  
  const [formData, setFormData] = useState<Pick<Trip, 'driver' | 'date' | 'license_plate'>>({
  driver: currentUser.id,
  date: today!,
  license_plate: ""
});

  const displayName = currentUser.last_name && currentUser.first_name 
    ? `${currentUser.last_name} ${currentUser.first_name}`
    : currentUser.username;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.license_plate) {
      alert('Please select a license plate');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createTrip(formData);
      
      alert('Trip created successfully!');
      router.push('/fleet/trips')
      
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Trip</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to create a new trip</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Driver Field (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="driver" className="text-sm font-medium text-gray-700">
              Driver
            </Label>
            <Input
              id="driver"
              type="text"
              value={displayName}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Date Field */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-gray-700">
              Date
            </Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* License Plate Select */}
          <div className="space-y-2">
            <Label htmlFor="license_plate" className="text-sm font-medium text-gray-700">
              License Plate
            </Label>
            <Select
              value={formData.license_plate}
              onValueChange={(value) => setFormData({ ...formData, license_plate: value })}
              required
            >
              <SelectTrigger id="license_plate">
                <SelectValue placeholder="Select a license plate" />
              </SelectTrigger>
              <SelectContent>
                {carOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.license_plate}
            className="w-full"
          >
            {isSubmitting ? 'Creating...' : 'Create Trip'}
          </Button>
        </div>
      </div>
    </div>
  );
}