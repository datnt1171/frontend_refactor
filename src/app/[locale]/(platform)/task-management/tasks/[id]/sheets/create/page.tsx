import React from 'react';
import { getStepTemplates, getFormularTemplates, getDataDetail } from '@/lib/api/server';
import CombinedSheetTable from '../components/FinishingSheet';

export default async function CreateSheetPageServer({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
    const { id } = await params;

    // Fetch templates in parallel
    const [stepTemplates, formularTemplates, taskDataDetail] = await Promise.all([
      getStepTemplates(),
      getFormularTemplates(),
      getDataDetail(id)
    ]);
    
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h1 className="text-2xl font-bold">Create New Finishing Sheet</h1>
          </div>
          <CombinedSheetTable 
            stepTemplates={stepTemplates}
            formularTemplates={formularTemplates}
            taskId={id}
            mode="create"
            taskDataDetail={taskDataDetail}
          />
        </div>
      </div>
    )
}