import React from 'react';
import { getFinishingSheet, getStepTemplates, getFormularTemplates, getDataDetail } from '@/lib/api/server';
import CombinedSheetTable from '../components/FinishingSheet'
import DeleteFinishingButton from '../components/DeleteFinishingButton'
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { FileSpreadsheet } from 'lucide-react'

export default async function SheetDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string, sheet_id: string }> 
}) {
    const { id, sheet_id } = await params;

    // Fetch all required data in parallel
    const [finishingSheet, stepTemplates, formularTemplates, taskDataDetail] = await Promise.all([
      getFinishingSheet(id, sheet_id),
      getStepTemplates(),
      getFormularTemplates(),
      getDataDetail(id)
    ]);
    console.log(taskDataDetail)
    
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Edit Finishing Sheet</h1>
            <div className='flex gap-2'>
              <DeleteFinishingButton 
                taskId={id}
                sheetId={sheet_id}
                finishingCode={finishingSheet.finishing_code}
              />
              <Button asChild>
                <Link href={`/task-management/tasks/${id}/sheets/${sheet_id}/blueprints`}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  View Sheets
                </Link>
              </Button>
            </div>
          </div>
          <CombinedSheetTable 
            data={finishingSheet}
            stepTemplates={stepTemplates}
            formularTemplates={formularTemplates}
            taskId={id}
            mode="edit"
            taskDataDetail={taskDataDetail}
          />
          
        </div>
        

      </div>
    )
}