import CreateTripForm from './CreateTripForm';
import { getCurrentUser } from '@/lib/api/server';
import { CAR_LICENSE_PLATE_OPTION } from '@/lib/utils/filter';

export default async function CreateTripPage() {
  const currentUser = await getCurrentUser();
  const carOptions = CAR_LICENSE_PLATE_OPTION
  
  return (
    <CreateTripForm 
      currentUser={currentUser} 
      carOptions={carOptions}
    />
  );
}