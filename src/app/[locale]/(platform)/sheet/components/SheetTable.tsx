'use client'
import React, { useState } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
import { Material, ProductionRecord } from '@/types';
import { stepTemplates, chemicalTemplates } from '@/data/sheet';
import { SheetHeader } from './SheetHeader';
import { Button } from '@/components/ui/button';
import { generatePDF } from '@/lib/pdf-generator';

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Main Component
const ProductionCRUDTable = () => {
  const [records, setRecords] = useState<ProductionRecord[]>([]);

  // Generic update function
  const updateRecord = (id: string, updates: Partial<ProductionRecord>) => {
    setRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...updates } : record
    ));
  };

  // Update material within a record
  const updateMaterial = (recordId: string, materialIndex: number, updates: Partial<Material>) => {
    setRecords(prev => prev.map(record => {
      if (record.id !== recordId) return record;
      
      return {
        ...record,
        materials: record.materials.map((material, index) =>
          index === materialIndex ? { ...material, ...updates } : material
        )
      };
    }));
  };

  // Add new record
  const addRecord = () => {
    const newRecord: ProductionRecord = {
      id: generateId(),
      stepId: '',
      chemicalId: '',
      stepname: '',
      viscosity_en: '',
      viscosity_vn: '',
      spec_en: '',
      spec_vn: '',
      holdTime: '',
      chemicalCode: '',
      consumption: '',
      materials: [
        {
          materialCode: '',
          materialName: '',
          ratio: '',
          qty: '',
          unit: '',
          checkResult: '',
          correctAction: '',
          te1Signature: '',
          customerSignature: ''
        }
      ]
    };
    setRecords(prev => [...prev, newRecord]);
  };

  // Delete record
  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  // Handle step dropdown change
  const handleStepChange = (recordId: string, stepId: string) => {
    const step = stepTemplates.find(s => s.id === stepId);
    if (!step) return;

    updateRecord(recordId, {
      stepId: step.id,
      stepname: step.stepname,
      viscosity_en: step.viscosity_en,
      viscosity_vn: step.viscosity_vn,
      spec_en: step.spec_en,
      spec_vn: step.spec_vn,
      holdTime: step.holdTime,
    });
  };

  // Handle chemical dropdown change
  const handleChemicalChange = (recordId: string, chemicalId: string) => {
    const chemical = chemicalTemplates.find(c => c.id === chemicalId);
    if (!chemical) return;

    updateRecord(recordId, {
      chemicalId: chemical.id,
      chemicalCode: chemical.chemicalCode,
      consumption: chemical.consumption,
      materials: [...chemical.materials],
    });
  };

  // Add material to a record
  const addMaterial = (recordId: string) => {
    const newMaterial: Material = {
      materialCode: '',
      materialName: '',
      ratio: '',
      qty: '',
      unit: '',
      checkResult: '',
      correctAction: '',
      te1Signature: '',
      customerSignature: ''
    };

    setRecords(prev => prev.map(record =>
      record.id === recordId 
        ? { ...record, materials: [...record.materials, newMaterial] }
        : record
    ));
  };

  // Remove material from a record
  const removeMaterial = (recordId: string, materialIndex: number) => {
    setRecords(prev => prev.map(record =>
      record.id === recordId
        ? { ...record, materials: record.materials.filter((_, index) => index !== materialIndex) }
        : record
    ));
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button onClick={addRecord} className="flex items-center gap-2">
          <Plus size={16} />
          Add Record
        </Button>
        <Button 
          onClick={() => generatePDF(records)} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={records.length === 0}
        >
          <FileText size={16} />
          Generate PDF
        </Button>
      </div>

      <div>
        <table className="w-full border-collapse border border-gray-300 text-xs">
          <SheetHeader />
          <tbody>
            {records.map((record) => (
              <React.Fragment key={record.id}>
                {record.materials.map((material, materialIndex) => (
                  <tr key={`${record.id}-${materialIndex}`} className={materialIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {/* ID - only show on first material row */}
                    {materialIndex === 0 && (
                      <td className="border border-gray-300 p-2" rowSpan={record.materials.length} style={{ width: '2.39%', minWidth: '2.39%', maxWidth: '2.39%' }}>
                        {record.id.slice(-4)}
                      </td>
                    )}

                    {/* Step Name Dropdown - only show on first material row */}
                    {materialIndex === 0 && (
                      <td className="border border-gray-300 p-1" rowSpan={record.materials.length} style={{ width: '4.14%', minWidth: '4.14%', maxWidth: '4.14%' }}>
                        <select
                          value={record.stepId}
                          onChange={(e) => handleStepChange(record.id, e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded"
                        >
                          <option value="">Select Step</option>
                          {stepTemplates.map(step => (
                            <option key={step.id} value={step.id}>
                              {step.stepname}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}

                    {/* Step Data - only show on first material row */}
                    {materialIndex === 0 && (
                      <>
                        <td className="border border-gray-300 p-1" rowSpan={record.materials.length} style={{ width: '7.37%', minWidth: '7.37%', maxWidth: '7.37%' }}>
                          {record.viscosity_en}
                        </td>
                        <td className="border border-gray-300 p-1" rowSpan={record.materials.length} style={{ width: '7.37%', minWidth: '7.37%', maxWidth: '7.37%' }}>
                          {record.viscosity_vn}
                        </td>
                        <td className="border border-gray-300 p-1 break-words" rowSpan={record.materials.length} style={{ width: '7.37%', minWidth: '7.37%', maxWidth: '7.37%' }}>
                          {record.spec_en}
                        </td>
                        <td className="border border-gray-300 p-1 break-words" rowSpan={record.materials.length} style={{ width: '7.37%', minWidth: '7.37%', maxWidth: '7.37%' }}>
                          {record.spec_vn}
                        </td>
                        <td className="border border-gray-300 p-1" rowSpan={record.materials.length} style={{ width: '3.02%', minWidth: '3.02%', maxWidth: '3.02%' }}>
                          {record.holdTime}
                        </td>
                      </>
                    )}

                    {/* Chemical Code Dropdown - only show on first material row */}
                    {materialIndex === 0 && (
                      <td className="border border-gray-300 p-1" rowSpan={record.materials.length} style={{ width: '5.61%', minWidth: '5.61%', maxWidth: '5.61%' }}>
                        <select
                          value={record.chemicalId}
                          onChange={(e) => handleChemicalChange(record.id, e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded"
                        >
                          <option value="">Select Chemical</option>
                          {chemicalTemplates.map(chemical => (
                            <option key={chemical.id} value={chemical.id}>
                              {chemical.chemicalCode}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}

                    {/* Consumption - only show on first material row */}
                    {materialIndex === 0 && (
                      <td className="border border-gray-300 p-1" rowSpan={record.materials.length} style={{ width: '5.61%', minWidth: '5.61%', maxWidth: '5.61%' }}>
                        {record.consumption}
                      </td>
                    )}

                    {/* Material Data - show for each material */}
                    <td className="border border-gray-300 p-1" style={{ width: '6.74%', minWidth: '6.74%', maxWidth: '6.74%' }}>
                      <input
                        type="text"
                        value={material.materialCode}
                        onChange={(e) => updateMaterial(record.id, materialIndex, { materialCode: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="Code"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '7.51%', minWidth: '7.51%', maxWidth: '7.51%' }}>
                      <input
                        type="text"
                        value={material.materialName}
                        onChange={(e) => updateMaterial(record.id, materialIndex, { materialName: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="Name"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '3.51%', minWidth: '3.51%', maxWidth: '3.51%' }}>
                      <input
                        type="text"
                        value={material.ratio}
                        onChange={(e) => updateMaterial(record.id, materialIndex, { ratio: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="Ratio"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '3.51%', minWidth: '3.51%', maxWidth: '3.51%' }}>
                      <input
                        type="text"
                        value={material.qty}
                        onChange={(e) => updateMaterial(record.id, materialIndex, { qty: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="Qty"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '3.51%', minWidth: '3.51%', maxWidth: '3.51%' }}>
                      <input
                        type="text"
                        value={material.unit}
                        onChange={(e) => updateMaterial(record.id, materialIndex, { unit: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="Unit"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '8%', minWidth: '8%', maxWidth: '8%' }}>
                      <input
                        type="text"
                        value={material.checkResult}
                        onChange={(e) => updateMaterial(record.id, materialIndex, { checkResult: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="Result"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '8%', minWidth: '8%', maxWidth: '8%' }}>
                      <input
                        type="text"
                        value={material.correctAction}
                        onChange={(e) => updateMaterial(record.id, materialIndex, { correctAction: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="Action"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '4.49%', minWidth: '4.49%', maxWidth: '4.49%' }}>
                      <input
                        type="text"
                        value={material.te1Signature}
                        onChange={(e) => updateMaterial(record.id, materialIndex, { te1Signature: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="TE1"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '4.49%', minWidth: '4.49%', maxWidth: '4.49%' }}>
                      <input
                        type="text"
                        value={material.customerSignature}
                        onChange={(e) => updateMaterial(record.id, materialIndex, { customerSignature: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="Customer"
                      />
                    </td>

                    {/* Actions - only show on first material row */}
                    {materialIndex === 0 && (
                      <td className="border border-gray-300 p-1" rowSpan={record.materials.length} style={{ width: '2%', minWidth: '2%', maxWidth: '2%' }}>
                        <div className="flex flex-col gap-1">
                          <Button
                            onClick={() => addMaterial(record.id)}
                            size="sm"
                            variant="outline"
                            className="h-6 px-2"
                            title="Add Material"
                          >
                            <Plus size={10} />
                          </Button>
                          <Button
                            onClick={() => deleteRecord(record.id)}
                            size="sm"
                            variant="destructive"
                            className="h-6 px-2"
                            title="Delete Record"
                          >
                            <Trash2 size={10} />
                          </Button>
                          {record.materials.length > 1 && (
                            <Button
                              onClick={() => removeMaterial(record.id, materialIndex)}
                              size="sm"
                              variant="secondary"
                              className="h-6 px-2"
                              title="Remove Material"
                            >
                              -
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionCRUDTable;