'use client'
import React, { useState } from 'react';
import { Plus, Trash2, FileText, MoreHorizontal, ArrowDownFromLine, ArrowUpToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generatePDF } from '@/lib/pdf-generator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Combobox } from "@/components/ui/combobox"
import type { StepTemplate, FormularTemplate, SheetRow, RowProduct, FinishingSheet, SheetRowWrite } from '@/types';

interface CombinedSheetTableProps {
  data: FinishingSheet;
  stepTemplates: StepTemplate[];
  formularTemplates: FormularTemplate[];
}

// Generate unique ID for new records
let idCounter = 0;
const generateId = () => `temp-${(++idCounter).toString()}`;

// Main Component
const CombinedSheetTable: React.FC<CombinedSheetTableProps> = ({ 
  data,
  stepTemplates, 
  formularTemplates
}) => {
  const [records, setRecords] = useState<SheetRow[]>(data.rows || []);

  // Generic update function for records
  const updateRecord = (id: string, updates: Partial<SheetRow>) => {
    setRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...updates } : record
    ));
  };


  // Create empty product
  const makeEmptyProduct = (): RowProduct => ({
    id: generateId(),
    order: 1,
    product_code: '',
    product_name: '',
    ratio: '',
    qty: '',
    unit: '',
    check_result: '',
    correct_action: '',
    te1_signature: '',
    customer_signature: '',
    created_by: '',
    created_at: new Date().toISOString(),
    updated_by: '',
    updated_at: new Date().toISOString(),
  });

  // Create empty record
  const makeEmptyRecord = (): SheetRow => ({
    id: generateId(),
    step_template: null,
    formular_template: null,
    step_num: 0,
    spot: null,
    stepname_en: '',
    stepname_vi: '',
    stepname_zh_hant: '',
    viscosity_en: '',
    viscosity_vi: '',
    viscosity_zh_hant: '',
    spec_en: '',
    spec_vi: '',
    spec_zh_hant: '',
    hold_time: '',
    chemical_code: '',
    consumption: '',
    created_at: new Date().toISOString(),
    created_by: '',
    updated_at: new Date().toISOString(),
    updated_by: '',
    products: [makeEmptyProduct()],
  });

  // Add new record
  const addRecord = () => {
    const newRecord = makeEmptyRecord();
    newRecord.step_num = records.length + 1;
    setRecords(prev => [...prev, newRecord]);
  };

  const addRecordAt = (index: number) => {
    const newRecord = makeEmptyRecord();
    setRecords(prev => {
      const newRecords = [
        ...prev.slice(0, index),
        newRecord,
        ...prev.slice(index),
      ];
      // Renumber all records
      return newRecords.map((record, idx) => ({
        ...record,
        step_num: idx + 1
      }));
    });
  };

  const addRecordAfter = (index: number) => {
    const newRecord = makeEmptyRecord();
    setRecords(prev => {
      const newRecords = [
        ...prev.slice(0, index + 1),
        newRecord,
        ...prev.slice(index + 1),
      ];
      // Renumber all records
      return newRecords.map((record, idx) => ({
        ...record,
        step_num: idx + 1
      }));
    });
  };

  // Delete record
  const deleteRecord = (id: string) => {
    setRecords(prev => {
      const filtered = prev.filter(record => record.id !== id);
      // Renumber remaining records
      return filtered.map((record, idx) => ({
        ...record,
        step_num: idx + 1
      }));
    });
  };

  // Handle step template dropdown change
  const handleStepChange = (recordId: string, stepTemplateId: string) => {
    const step = stepTemplates.find(s => s.id === stepTemplateId);
    if (!step) return;

    updateRecord(recordId, {
      step_template: step.id,
      stepname_en: step.name_en,
      stepname_vi: step.name_vi,
      stepname_zh_hant: step.name_zh_hant,
      spec_en: step.spec_en || '',
      spec_vi: step.spec_vi || '',
      spec_zh_hant: step.spec_zh_hant || '',
      hold_time: step.hold_time?.toString() || '',
      consumption: step.consumption,
    });
  };

  // Handle formular template dropdown change
  const handleFormularChange = (recordId: string, formularTemplateId: string) => {
    const formular = formularTemplates.find(f => f.id === formularTemplateId);
    if (!formular) return;


    const products: RowProduct[] = formular.products.map((product, idx) => ({
      id: generateId(),
      order: idx + 1,
      product_code: product.code,
      product_name: product.name,
      ratio: product.ratio?.toString() || '',
      qty: '', // This might need to be calculated based on consumption
      unit: product.unit || '',
      check_result: '',
      correct_action: '',
      te1_signature: '',
      customer_signature: '',
      created_by: '',
      created_at: new Date().toISOString(),
      updated_by: '',
      updated_at: new Date().toISOString(),
    }));

    updateRecord(recordId, {
      formular_template: formular.id,
      chemical_code: formular.code,
      viscosity_en: formular.viscosity?.toString() || '',
      viscosity_vi: formular.viscosity?.toString() || '',
      viscosity_zh_hant: formular.viscosity?.toString() || '',
      products: products.length > 0 ? products : [makeEmptyProduct()],
    });
  };

  // Create options for dropdowns
  const stepOptions = stepTemplates.map(step => ({
    value: step.id,
    label: `${step.short_name || step.name} - ${step.name}`,
  }));

  const formularOptions = formularTemplates.map(formular => ({
    value: formular.id,
    label: formular.code,
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

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-xs">
          {/* Header Section */}
          <thead className="bg-gray-100">
            {/* Product Title Row */}
            <tr>
              <td colSpan={18} className="border border-gray-300 px-2 py-2 text-center font-bold text-lg">
                {data.finishing_code}
              </td>
            </tr>
            
            {/* Product Details Row */}
            <tr className="text-left">
              <td colSpan={3} className="border border-gray-300 p-1">
                <div>
                  <strong>Name:</strong> {data.name}<br/>
                  <strong>Sheen:</strong> {data.sheen}<br/>
                  <strong>DFT:</strong> {data.dft}<br/>
                  <strong>Chemical:</strong> {data.type_of_paint}<br/>
                  <strong>Substrate:</strong> {data.type_of_substrate}<br/>
                  <strong>Grain Filling:</strong> {data.finishing_surface_grain}<br/>
                  <strong>Developed/Duplicated by:</strong> {data.sampler}
                </div>
              </td>
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Chemical waste:</strong> {data.chemical_waste}<br/>
                <br/>
                <strong>Conveyor speed:</strong> {data.conveyor_speed}
              </td>
              <td colSpan={3} className="border border-gray-300 p-1">
                1. Wood substrate before finishing process should be below 10% MC<br/>
                2. Last sanding on white wood should be grit #240<br/>
                3. White wood surface must be free from grease, oil or other contamination. Please reject white wood with any defects.
              </td>
              <td colSpan={2} className="border border-gray-300 p-1">
                <strong>With panel test:</strong> <span className={`inline-block w-4 h-4 border border-gray-400 mr-1 ${data.with_panel_test ? 'bg-black' : ''}`}></span><br/>
                (Có mẫu test chuyền)<br/>
                <strong>No panel test:</strong> <span className={`inline-block w-4 h-4 border border-gray-400 mr-1 ${!data.with_panel_test ? 'bg-black' : ''}`}></span><br/>
                (Không có mẫu test chuyền)<br/>
                <strong>Testing:</strong> <span className={`inline-block w-4 h-4 border border-gray-400 mr-1 ${data.testing ? 'bg-black' : ''}`}></span><br/>
                <strong>Chemical Yellowing:</strong> <span className={`inline-block w-4 h-4 border border-gray-400 mr-1 ${data.chemical_yellowing ? 'bg-black' : ''}`}></span>
              </td>
              <td colSpan={5} className="border border-gray-300 p-1">
                4. Always ask TE-1 for advice in case of changing process mixing ratio, application amount, drying time, application method, must get approval form... If there is any changing.<br/>
                5. Strictly follow the process, always refer to the PCP<br/>
                6. Viscosity reading using NK2 cup standard.
              </td>
              <td colSpan={4} className="border border-gray-300 p-1 text-center">
                <div className="font-bold">DAILY CHECK LIST</div>
                <div>(Kiểm tra hằng ngày)</div>
                <div>Date: _______________</div>
              </td>
            </tr>

            {/* Column Headers Row */}
            <tr className="font-bold text-center">
              <td className="border border-gray-300 p-1" style={{ width: '2.39%' }}>Step</td>
              <td className="border border-gray-300 p-1" style={{ width: '4.14%' }}>Step Name</td>
              <td className="border border-gray-300 p-1" style={{ width: '7.37%' }}>Viscosity & Wet Mill Thickness (EN)</td>
              <td className="border border-gray-300 p-1" style={{ width: '7.37%' }}>Viscosity & Wet Mill Thickness (VN)</td>
              <td className="border border-gray-300 p-1" style={{ width: '7.37%' }}>SPEC EN</td>
              <td className="border border-gray-300 p-1" style={{ width: '7.37%' }}>SPEC VN</td>
              <td className="border border-gray-300 p-1" style={{ width: '3.02%' }}>Hold Time (min)</td>
              <td className="border border-gray-300 p-1" style={{ width: '5.61%' }}>Chemical Mixing Code</td>
              <td className="border border-gray-300 p-1" style={{ width: '5.61%' }}>Consumption (per m2)</td>
              <td className="border border-gray-300 p-1" style={{ width: '6.74%' }}>Material Code</td>
              <td className="border border-gray-300 p-1" style={{ width: '7.51%' }}>Material Name</td>
              <td className="border border-gray-300 p-1" style={{ width: '3.51%' }}>Ratio</td>
              <td className="border border-gray-300 p-1" style={{ width: '3.51%' }}>Qty (per m2)</td>
              <td className="border border-gray-300 p-1" style={{ width: '3.51%' }}>Unit</td>
              <td className="border border-gray-300 p-1" style={{ width: '8%' }}>Check Result</td>
              <td className="border border-gray-300 p-1" style={{ width: '8%' }}>Correct Action</td>
              <td className="border border-gray-300 p-1" style={{ width: '4.49%' }}>TE-1's Name & Signature</td>
              <td className="border border-gray-300 p-1" style={{ width: '4.49%' }}>Customer Signature</td>
              <td className="border border-gray-300 p-1" style={{ width: '2%' }}>Actions</td>
            </tr>
          </thead>

          {/* Body Section */}
          <tbody className="text-left">
            {records.map((record, recordIndex) => (
              <React.Fragment key={record.id}>
                {record.products.map((product, productIndex) => (
                  <tr
                    key={`${record.id}-${productIndex}`}
                    className={productIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {/* Step Number - only show on first product row */}
                    {productIndex === 0 && (
                      <td
                        className="border border-gray-300 p-1"
                        rowSpan={record.products.length}
                        style={{ width: '2.39%', minWidth: '2.39%', maxWidth: '2.39%' }}
                      >
                        <div>Step {record.step_num}</div>
                        <input
                          type="text"
                          value={record.spot || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateRecord(record.id, {
                              spot: val === '' ? null : val,
                            });
                          }}
                          className="w-full p-1 mt-1 border border-gray-300 rounded"
                          placeholder="Spot"
                        />
                      </td>
                    )}

                    {/* Step Name Dropdown - only show on first product row */}
                    {productIndex === 0 && (
                      <td 
                        className="border border-gray-300 p-1" 
                        rowSpan={record.products.length} 
                        style={{ width: '4.14%', minWidth: '4.14%', maxWidth: '4.14%' }}
                      >
                        <Combobox
                          options={stepOptions}
                          value={record.step_template || ''}
                          onValueChange={(val) => handleStepChange(record.id, val)}
                          placeholder="Select Step"
                          searchPlaceholder="Search steps..."
                          emptyMessage="No step found."
                          className="text-xs"
                        />
                      </td>
                    )}

                    {/* Viscosity & Wet Mill Thickness - only show on first product row */}
                    {productIndex === 0 && (
                      <>
                        <td 
                          className="border border-gray-300 p-1" 
                          rowSpan={record.products.length} 
                          style={{ width: '7.37%', minWidth: '7.37%', maxWidth: '7.37%' }}
                        >
                          {record.viscosity_en}
                        </td>
                        <td 
                          className="border border-gray-300 p-1" 
                          rowSpan={record.products.length} 
                          style={{ width: '7.37%', minWidth: '7.37%', maxWidth: '7.37%' }}
                        >
                          {record.viscosity_vi}
                        </td>
                      </>
                    )}

                    {/* SPEC - only show on first product row */}
                    {productIndex === 0 && (
                      <>
                        <td 
                          className="border border-gray-300 p-1 break-words" 
                          rowSpan={record.products.length} 
                          style={{ width: '7.37%', minWidth: '7.37%', maxWidth: '7.37%' }}
                        >
                          <div>{record.spec_en}</div>
                        </td>
                        <td 
                          className="border border-gray-300 p-1 break-words" 
                          rowSpan={record.products.length} 
                          style={{ width: '7.37%', minWidth: '7.37%', maxWidth: '7.37%' }}
                        >
                          <div>{record.spec_vi}</div>
                        </td>
                      </>
                    )}

                    {/* Hold Time - only show on first product row */}
                    {productIndex === 0 && (
                      <td 
                        className="border border-gray-300 p-1" 
                        rowSpan={record.products.length} 
                        style={{ width: '3.02%', minWidth: '3.02%', maxWidth: '3.02%' }}
                      >
                        {record.hold_time}
                      </td>
                    )}

                    {/* Chemical Mixing Code Dropdown - only show on first product row */}
                    {productIndex === 0 && (
                      <td 
                        className="border border-gray-300 p-1" 
                        rowSpan={record.products.length} 
                        style={{ width: '5.61%', minWidth: '5.61%', maxWidth: '5.61%' }}
                      >
                        <Combobox
                          options={formularOptions}
                          value={record.formular_template || ''}
                          onValueChange={(val) => handleFormularChange(record.id, val)}
                          placeholder="Select Formula"
                          searchPlaceholder="Search formulas..."
                          emptyMessage="No formula found."
                          className="text-xs"
                        />
                      </td>
                    )}

                    {/* Consumption - only show on first product row */}
                    {productIndex === 0 && (
                      <td 
                        className="border border-gray-300 p-1" 
                        rowSpan={record.products.length} 
                        style={{ width: '5.61%', minWidth: '5.61%', maxWidth: '5.61%' }}
                      >
                        {record.consumption}
                      </td>
                    )}

                    {/* Product Data - show for each product */}
                    <td className="border border-gray-300 p-1 text-center" style={{ width: '6.74%', minWidth: '6.74%', maxWidth: '6.74%' }}>
                      {product.product_code}
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '7.51%', minWidth: '7.51%', maxWidth: '7.51%' }}>
                      {product.product_name}
                    </td>
                    <td className="border border-gray-300 p-1 text-center" style={{ width: '3.51%', minWidth: '3.51%', maxWidth: '3.51%' }}>
                      {product.ratio}
                    </td>
                    <td className="border border-gray-300 p-1 text-center" style={{ width: '3.51%', minWidth: '3.51%', maxWidth: '3.51%' }}>
                      {product.qty}
                    </td>
                    <td className="border border-gray-300 p-1 text-center" style={{ width: '3.51%', minWidth: '3.51%', maxWidth: '3.51%' }}>
                      {product.unit}
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '8%', minWidth: '8%', maxWidth: '8%' }}>
                      {product.check_result}
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '8%', minWidth: '8%', maxWidth: '8%' }}>
                      {product.correct_action}
                    </td>
                    <td className="border border-gray-300 p-1 text-center" style={{ width: '4.49%', minWidth: '4.49%', maxWidth: '4.49%' }}>
                      {product.te1_signature}
                    </td>
                    <td className="border border-gray-300 p-1 text-center" style={{ width: '4.49%', minWidth: '4.49%', maxWidth: '4.49%' }}>
                      {product.customer_signature}
                    </td>


                    {/* Actions - only show on first product row */}
                    {productIndex === 0 && (
                      <td
                        className="border border-gray-300 p-1"
                        rowSpan={record.products.length}
                        style={{ width: "2%", minWidth: "2%", maxWidth: "2%" }}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center justify-center w-full h-full p-1 text-gray-500 hover:text-black">
                              <MoreHorizontal size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => addRecordAt(recordIndex)}>
                              <ArrowUpToLine size={14} /> Insert Before
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addRecordAfter(recordIndex)}>
                              <ArrowDownFromLine size={14} /> Insert After
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteRecord(record.id)}
                              className="text-red-600"
                            >
                              <Trash2 size={14} /> Delete Record
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

export default CombinedSheetTable;