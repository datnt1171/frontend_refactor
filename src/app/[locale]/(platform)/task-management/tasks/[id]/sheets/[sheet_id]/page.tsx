import React from 'react';
import { getFinishingSheet, getStepTemplates, getFormularTemplates } from '@/lib/api/server';
import CombinedSheetTable from '../components/FinishingSheet'
import DeleteFinishingButton from '../components/DeleteFinishingButton'
export default async function SheetDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string, sheet_id: string }> 
}) {
    const { id, sheet_id } = await params;

    // Fetch all required data in parallel
    const [finishingSheet, stepTemplates, formularTemplates] = await Promise.all([
      getFinishingSheet(id, sheet_id),
      getStepTemplates(),
      getFormularTemplates()
    ]);
    
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Edit Finishing Sheet</h1>
            <DeleteFinishingButton 
              taskId={id}
              sheetId={sheet_id}
              finishingCode={finishingSheet.finishing_code}
            />
          </div>
          <CombinedSheetTable 
            data={finishingSheet}
            stepTemplates={stepTemplates}
            formularTemplates={formularTemplates}
            taskId={id}
            mode="edit"
          />
          
        </div>
        

      </div>
    )
}