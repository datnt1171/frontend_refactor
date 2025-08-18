'use client'
import React, { useState } from 'react';
import { Plus, Trash, Trash2, FileText, MoreHorizontal, ArrowDownFromLine, ArrowUpToLine } from 'lucide-react';
import { Material, ProductionRecord } from '@/types';
import { stepTemplates, chemicalTemplates } from '@/data/sheet';
import { SheetHeader } from './SheetHeader';
import { Button } from '@/components/ui/button';
import { generatePDF } from '@/lib/pdf-generator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Combobox } from "@/components/ui/combobox"

// Generate unique ID
let idCounter = 0;
const generateId = () => (++idCounter).toString();

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

  // Reusable emply record
  const makeEmptyRecord = (): ProductionRecord => ({
    id: generateId(),
    booth: null,
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
        customerSignature: '',
      },
    ],
  });
  // Add new record
  const addRecord = () => {
    setRecords(prev => [...prev, makeEmptyRecord()]);
  };

  const addRecordAt = (index: number) => {
    setRecords(prev => [
      ...prev.slice(0, index),
      makeEmptyRecord(),
      ...prev.slice(index),
    ]);
  };

  const addRecordAfter = (index: number) => {
    setRecords(prev => [
      ...prev.slice(0, index + 1),
      makeEmptyRecord(),
      ...prev.slice(index + 1),
    ]);
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

  const stepOptions = stepTemplates.map(step => ({
    value: step.id,
    label: step.stepname,
  }));

  const chemicalOptions = chemicalTemplates.map(chemical => ({
    value: chemical.id,
    label: chemical.chemicalCode,
  }));

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
          <tbody className="text-left">
            {records.map((record, recordIndex) => (
              <React.Fragment key={record.id}>
                {record.materials.map((material, materialIndex) => (
                  <tr
                    key={`${record.id}-${materialIndex}`}
                    className={materialIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {/* Step Number (auto-renumbered) - only show on first material row */}
                    {materialIndex === 0 && (
                      <td
                        className="border border-gray-300 p-1"
                        rowSpan={record.materials.length}
                        style={{ width: '2.39%', minWidth: '2.39%', maxWidth: '2.39%' }}
                      >
                        Step {recordIndex + 1} Booth
                        <input
                          type="number"
                          value={record.booth ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateRecord(record.id, {
                              booth: val === '' ? null : Number(val),
                            });
                          }}
                          className="w-full p-1 border border-gray-300 rounded"
                          placeholder="Booth"
                        />
                      </td>
                    )}

                    {/* Step Name Dropdown - only show on first material row */}
                    {materialIndex === 0 && (
                      <td className="border border-gray-300 p-1" rowSpan={record.materials.length} style={{ width: '4.14%', minWidth: '4.14%', maxWidth: '4.14%' }}>
                        <Combobox
                          options={stepOptions}
                          value={record.stepId}
                          onValueChange={(val) => handleStepChange(record.id, val)}
                          placeholder="Select Step"
                          searchPlaceholder="Search steps..."
                          emptyMessage="No step found."
                          className="text-xs"
                        />
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
                        <Combobox
                          options={chemicalOptions}
                          value={record.chemicalId}
                          onValueChange={(val) => handleChemicalChange(record.id, val)}
                          placeholder="Select Chemical"
                          searchPlaceholder="Search chemicals..."
                          emptyMessage="No chemical found."
                          className="text-xs"
                        />
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
                    <td
                      className="border border-gray-300 p-1"
                      rowSpan={record.materials.length}
                      style={{ width: "2%", minWidth: "2%", maxWidth: "2%" }}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center justify-center w-full h-full p-1 text-gray-500 hover:text-black">
                            <MoreHorizontal size={16} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => addMaterial(record.id)}>
                            <Plus /> Add Material
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => addRecordAt(recordIndex)}>
                            <ArrowUpToLine /> Insert Before
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => addRecordAfter(recordIndex)}>
                            <ArrowDownFromLine /> Insert After
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => removeMaterial(record.id, materialIndex)}>
                            <Trash /> Delete Material
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteRecord(record.id)}
                            className="text-red-600"
                          >
                            <Trash2 /> Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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