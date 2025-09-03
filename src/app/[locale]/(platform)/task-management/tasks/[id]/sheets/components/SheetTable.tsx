'use client'
import React, { useState } from 'react';
import { Plus, Trash, Trash2, FileText, MoreHorizontal, ArrowDownFromLine, ArrowUpToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generatePDF } from '@/lib/pdf-generator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Combobox } from "@/components/ui/combobox"
import type { StepTemplate, FormularTemplate, SheetRow, RowProduct } from '@/types';

// Props interface for SheetTable
interface SheetTableProps {
  stepTemplates: StepTemplate[];
  formularTemplates: FormularTemplate[];
  initialRecords?: SheetRow[];
}

// Generate unique ID for new records
let idCounter = 0;
const generateId = () => `temp-${(++idCounter).toString()}`;

// Main Component
const SheetTable: React.FC<SheetTableProps> = ({ 
  stepTemplates, 
  formularTemplates, 
  initialRecords = [] 
}) => {
  const [records, setRecords] = useState<SheetRow[]>(initialRecords);

  // Generic update function for records
  const updateRecord = (id: string, updates: Partial<SheetRow>) => {
    setRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...updates } : record
    ));
  };

  // Update product within a record
  const updateProduct = (recordId: string, productIndex: number, updates: Partial<RowProduct>) => {
    setRecords(prev => prev.map(record => {
      if (record.id !== recordId) return record;
      
      return {
        ...record,
        products: record.products.map((product, index) =>
          index === productIndex ? { ...product, ...updates } : product
        )
      };
    }));
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
      stepname_en: step.name_en || step.name || '',
      stepname_vi: step.name_vi || step.name || '',
      stepname_zh_hant: step.name_zh_hant || step.name || '',
      spec_en: step.spec_en || '',
      spec_vi: step.spec_vi || '',
      spec_zh_hant: step.spec_zh_hant || '',
      hold_time: step.hold_time?.toString() || '',
      // Clear formular template when step changes
      formular_template: null,
      chemical_code: '',
      consumption: '',
      viscosity_en: '',
      viscosity_vi: '',
      viscosity_zh_hant: '',
    });
  };

  // Handle formular template dropdown change
  const handleFormularChange = (recordId: string, formularTemplateId: string) => {
    const formular = formularTemplates.find(f => f.id === formularTemplateId);
    if (!formular) return;

    // Convert ProductTemplate[] to RowProduct[]
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
      consumption: '', // You might want to add consumption to FormularTemplate
      products: products.length > 0 ? products : [makeEmptyProduct()],
    });
  };

  // Add product to a record
  const addProduct = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    const newProduct = makeEmptyProduct();
    newProduct.order = record ? record.products.length + 1 : 1;

    setRecords(prev => prev.map(record =>
      record.id === recordId 
        ? { ...record, products: [...record.products, newProduct] }
        : record
    ));
  };

  // Remove product from a record
  const removeProduct = (recordId: string, productIndex: number) => {
    setRecords(prev => prev.map(record =>
      record.id === recordId
        ? { 
            ...record, 
            products: record.products.filter((_, index) => index !== productIndex)
              .map((product, idx) => ({ ...product, order: idx + 1 })) // Renumber
          }
        : record
    ));
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
                          className="w-full p-1 mt-1 border border-gray-300 rounded text-xs"
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
                          <input
                            type="text"
                            value={record.viscosity_en}
                            onChange={(e) => updateRecord(record.id, { viscosity_en: e.target.value })}
                            className="w-full p-1 border border-gray-300 rounded text-xs"
                            placeholder="EN"
                          />
                        </td>
                        <td 
                          className="border border-gray-300 p-1" 
                          rowSpan={record.products.length} 
                          style={{ width: '7.37%', minWidth: '7.37%', maxWidth: '7.37%' }}
                        >
                          <input
                            type="text"
                            value={record.viscosity_vi}
                            onChange={(e) => updateRecord(record.id, { viscosity_vi: e.target.value })}
                            className="w-full p-1 border border-gray-300 rounded text-xs"
                            placeholder="VN"
                          />
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
                          <div className="text-xs">{record.spec_en}</div>
                        </td>
                        <td 
                          className="border border-gray-300 p-1 break-words" 
                          rowSpan={record.products.length} 
                          style={{ width: '7.37%', minWidth: '7.37%', maxWidth: '7.37%' }}
                        >
                          <div className="text-xs">{record.spec_vi}</div>
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
                        <input
                          type="text"
                          value={record.hold_time}
                          onChange={(e) => updateRecord(record.id, { hold_time: e.target.value })}
                          className="w-full p-1 border border-gray-300 rounded text-xs"
                          placeholder="Time"
                        />
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
                        <input
                          type="text"
                          value={record.consumption}
                          onChange={(e) => updateRecord(record.id, { consumption: e.target.value })}
                          className="w-full p-1 border border-gray-300 rounded text-xs"
                          placeholder="Consumption"
                        />
                      </td>
                    )}

                    {/* Product Data - show for each product */}
                    <td className="border border-gray-300 p-1" style={{ width: '6.74%', minWidth: '6.74%', maxWidth: '6.74%' }}>
                      <input
                        type="text"
                        value={product.product_code}
                        onChange={(e) => updateProduct(record.id, productIndex, { product_code: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded text-xs"
                        placeholder="Code"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '7.51%', minWidth: '7.51%', maxWidth: '7.51%' }}>
                      <input
                        type="text"
                        value={product.product_name}
                        onChange={(e) => updateProduct(record.id, productIndex, { product_name: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded text-xs"
                        placeholder="Name"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '3.51%', minWidth: '3.51%', maxWidth: '3.51%' }}>
                      <input
                        type="text"
                        value={product.ratio}
                        onChange={(e) => updateProduct(record.id, productIndex, { ratio: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded text-xs"
                        placeholder="Ratio"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '3.51%', minWidth: '3.51%', maxWidth: '3.51%' }}>
                      <input
                        type="text"
                        value={product.qty}
                        onChange={(e) => updateProduct(record.id, productIndex, { qty: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded text-xs"
                        placeholder="Qty"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '3.51%', minWidth: '3.51%', maxWidth: '3.51%' }}>
                      <input
                        type="text"
                        value={product.unit}
                        onChange={(e) => updateProduct(record.id, productIndex, { unit: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded text-xs"
                        placeholder="Unit"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '8%', minWidth: '8%', maxWidth: '8%' }}>
                      <input
                        type="text"
                        value={product.check_result}
                        onChange={(e) => updateProduct(record.id, productIndex, { check_result: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded text-xs"
                        placeholder="Result"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '8%', minWidth: '8%', maxWidth: '8%' }}>
                      <input
                        type="text"
                        value={product.correct_action}
                        onChange={(e) => updateProduct(record.id, productIndex, { correct_action: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded text-xs"
                        placeholder="Action"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '4.49%', minWidth: '4.49%', maxWidth: '4.49%' }}>
                      <input
                        type="text"
                        value={product.te1_signature}
                        onChange={(e) => updateProduct(record.id, productIndex, { te1_signature: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded text-xs"
                        placeholder="TE1"
                      />
                    </td>
                    <td className="border border-gray-300 p-1" style={{ width: '4.49%', minWidth: '4.49%', maxWidth: '4.49%' }}>
                      <input
                        type="text"
                        value={product.customer_signature}
                        onChange={(e) => updateProduct(record.id, productIndex, { customer_signature: e.target.value })}
                        className="w-full p-1 border border-gray-300 rounded text-xs"
                        placeholder="Customer"
                      />
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
                            <DropdownMenuItem onClick={() => addProduct(record.id)}>
                              <Plus size={14} /> Add Product
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addRecordAt(recordIndex)}>
                              <ArrowUpToLine size={14} /> Insert Before
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addRecordAfter(recordIndex)}>
                              <ArrowDownFromLine size={14} /> Insert After
                            </DropdownMenuItem>
                            {record.products.length > 1 && (
                              <DropdownMenuItem onClick={() => removeProduct(record.id, productIndex)}>
                                <Trash size={14} /> Delete Product
                              </DropdownMenuItem>
                            )}
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

export default SheetTable;