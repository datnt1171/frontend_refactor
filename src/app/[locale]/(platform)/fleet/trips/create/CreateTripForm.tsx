'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ReactSelect from 'react-select';
import type { UserDetail, Trip } from '@/types';
import { createTrip } from '@/lib/api/client/fleet';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface CreateTripFormProps {
  currentUser: UserDetail;
  carOptions: Array<{ value: string; label: string }>;
}

export default function CreateTripForm({ currentUser, carOptions }: CreateTripFormProps) {
  const t = useTranslations()
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
      
      alert(t('common.CreateSuccessfully'));
      router.push('/fleet/trips')
      
    } catch (error) {
      console.error('Error creating trip:', error);
      alert(t('common.CreateFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('fleet.trip.createTrip')}</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Driver Field (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="driver" className="text-sm font-medium text-gray-700">
              {t('fleet.trip.driver')}
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
              {t('common.date')}
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
            </div>
          </div>

          {/* License Plate Select */}
          <div className="space-y-2">
            <Label htmlFor="license_plate" className="text-sm font-medium text-gray-700">
              {t('fleet.trip.licensePlate')}
            </Label>
            <ReactSelect
              inputId="license_plate"
              options={carOptions}
              value={carOptions.find(option => option.value === formData.license_plate) || null}
              onChange={(selectedOption) => setFormData({ ...formData, license_plate: selectedOption?.value || "" })}
              placeholder={t('filter.selectLicensePlate')}
              noOptionsMessage={() => t('common.noData')}
              isSearchable={true}
              isClearable={true}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.license_plate}
            className="w-full"
          >
            {isSubmitting ? t('common.processing') : t('fleet.trip.createTrip')}
          </Button>
        </div>
      </div>
    </div>
  );
}