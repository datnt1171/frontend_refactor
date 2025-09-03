'use client'
import React, { useState } from 'react';
import { Combobox } from "@/components/ui/combobox"
import type { StepTemplate, FormularTemplate, SheetRow, RowProduct, FinishingSheet } from '@/types';
import { updateFinishingSheet1 } from '@/lib/api/client/api';
import { Button } from '@/components/ui/button';

interface CombinedSheetTableProps {
  data: FinishingSheet;
  stepTemplates: StepTemplate[];
  formularTemplates: FormularTemplate[];
  taskId: string;
}

// Generate unique ID for new records
let idCounter = 0;
const generateId = () => `temp-${(++idCounter).toString()}`;

// Main Component
const CombinedSheetTable: React.FC<CombinedSheetTableProps> = ({ 
  data,
  stepTemplates, 
  formularTemplates,
  taskId
}) => {
  const [finishingSheet, setFinishingSheet] = useState<FinishingSheet>(data);

  // Generic update function for the entire finishing sheet
  const updateFinishingSheet = (updates: Partial<FinishingSheet>) => {
    setFinishingSheet(prev => ({ ...prev, ...updates }));
  };

  // Generic update function for records (rows)
  const updateRecord = (id: string, updates: Partial<SheetRow>) => {
    setFinishingSheet(prev => ({
      ...prev,
      rows: prev.rows.map(record => 
        record.id === id ? { ...record, ...updates } : record
      )
    }));
  };

  // Update specific product within a row
  const updateProduct = (rowId: string, productId: string, updates: Partial<RowProduct>) => {
    setFinishingSheet(prev => ({
      ...prev,
      rows: prev.rows.map(row => 
        row.id === rowId 
          ? {
              ...row,
              products: row.products.map(product => 
                product.id === productId ? { ...product, ...updates } : product
              )
            }
          : row
      )
    }));
  };

  // Add new row
  const addRow = () => {
    const newRow: SheetRow = {
      id: generateId(),
      step_template: null,
      formular_template: null,
      step_num: finishingSheet.rows.length + 1,
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
    };

    setFinishingSheet(prev => ({
      ...prev,
      rows: [...prev.rows, newRow]
    }));
  };

  // Remove row
  const removeRow = (rowId: string) => {
    setFinishingSheet(prev => ({
      ...prev,
      rows: prev.rows.filter(row => row.id !== rowId)
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
    label: step.short_name,
  }));

  const formularOptions = formularTemplates.map(formular => ({
    value: formular.id,
    label: formular.code,
  }));

  // Save function
  const handleSave = async () => {
    console.log('finishingSheet:',finishingSheet)
    try {
      
      await updateFinishingSheet1(taskId, finishingSheet.id, finishingSheet);
      alert('Finishing sheet saved successfully');
    } catch (error) {
      alert("error");
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <Button onClick={addRow}>
            Add Row
          </Button>
        </div>
        <Button onClick={handleSave}>
            Save
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bordered-table-300-p-1 text-left text-xs">
          {/* Header Section */}
          <thead className="bg-gray-100">
            {/* Product Title Row */}
            <tr>
              <td colSpan={19}>
                <input
                  type="text"
                  value={finishingSheet.finishing_code}
                  onChange={(e) => updateFinishingSheet({ finishing_code: e.target.value })}
                  className="p-2 w-full text-center font-bold text-lg border-none bg-transparent"
                  placeholder="Finishing Code"
                />
              </td>
            </tr>
            
            {/* Product Details Row - Made editable */}
            <tr>
              <td colSpan={3}>
                <div>
                  <strong>Name:</strong> 
                  <input
                    type="text"
                    value={finishingSheet.name}
                    onChange={(e) => updateFinishingSheet({ name: e.target.value })}
                    className="ml-1 px-1"
                  />
                  <br/>
                  <strong>Sheen:</strong> 
                  <input
                    type="text"
                    value={finishingSheet.sheen}
                    onChange={(e) => updateFinishingSheet({ sheen: e.target.value })}
                    className="ml-1 px-1"
                  />
                  <br/>
                  <strong>DFT:</strong> 
                  <input
                    type="text"
                    value={finishingSheet.dft}
                    onChange={(e) => updateFinishingSheet({ dft: e.target.value })}
                    className="ml-1 px-1"
                  />
                  <br/>
                  <strong>Chemical:</strong> 
                  <input
                    type="text"
                    value={finishingSheet.type_of_paint}
                    onChange={(e) => updateFinishingSheet({ type_of_paint: e.target.value })}
                    className="ml-1 px-1"
                  />
                  <br/>
                  <strong>Substrate:</strong> 
                  <input
                    type="text"
                    value={finishingSheet.type_of_substrate}
                    onChange={(e) => updateFinishingSheet({ type_of_substrate: e.target.value })}
                    className="ml-1 px-1"
                  />
                  <br/>
                  <strong>Grain Filling:</strong> 
                  <input
                    type="text"
                    value={finishingSheet.finishing_surface_grain}
                    onChange={(e) => updateFinishingSheet({ finishing_surface_grain: e.target.value })}
                    className="ml-1 px-1"
                  />
                  <br/>
                  <strong>Developed/Duplicated by:</strong> 
                  <input
                    type="text"
                    value={finishingSheet.sampler}
                    onChange={(e) => updateFinishingSheet({ sampler: e.target.value })}
                    className="ml-1 px-1"
                  />
                </div>
              </td>
              <td colSpan={1}>
                <strong>Chemical waste:</strong> 
                <input
                  type="text"
                  value={finishingSheet.chemical_waste}
                  onChange={(e) => updateFinishingSheet({ chemical_waste: e.target.value })}
                  className="ml-1 px-1 w-full"
                />
                <br/><br/>
                <strong>Conveyor speed:</strong> 
                <input
                  type="text"
                  value={finishingSheet.conveyor_speed}
                  onChange={(e) => updateFinishingSheet({ conveyor_speed: e.target.value })}
                  className="ml-1 px-1 w-full"
                />
              </td>
              <td colSpan={3}>
              </td>
              <td colSpan={2}>
                <strong>With panel test:</strong> 
                <input
                  type="checkbox"
                  checked={finishingSheet.with_panel_test}
                  onChange={(e) => updateFinishingSheet({ with_panel_test: e.target.checked })}
                  className="ml-1"
                />
                <br/>
                (Có mẫu test chuyền)<br/>
                <strong>No panel test:</strong> 
                <input
                  type="checkbox"
                  checked={!finishingSheet.with_panel_test}
                  onChange={(e) => updateFinishingSheet({ with_panel_test: !e.target.checked })}
                  className="ml-1"
                />
                <br/>
                (Không có mẫu test chuyền)<br/>
                <strong>Testing:</strong> 
                <input
                  type="checkbox"
                  checked={finishingSheet.testing}
                  onChange={(e) => updateFinishingSheet({ testing: e.target.checked })}
                  className="ml-1"
                />
                <br/>
                <strong>Chemical Yellowing:</strong> 
                <input
                  type="checkbox"
                  checked={finishingSheet.chemical_yellowing}
                  onChange={(e) => updateFinishingSheet({ chemical_yellowing: e.target.checked })}
                  className="ml-1"
                />
              </td>
              <td colSpan={5}>
              </td>
              <td colSpan={4} className="text-center">
                <div className="font-bold">DAILY CHECK LIST</div>
                <div>(Kiểm tra hằng ngày)</div>
                <div>Date: _______________</div>
              </td>
            </tr>

            {/* Column Headers Row */}
            <tr className="font-bold text-center">
              <td style={{ width: '2.39%' }}>Step</td>
              <td style={{ width: '4.14%' }}>Step Name</td>
              <td style={{ width: '7.37%' }}>Viscosity & Wet Mill Thickness (EN)</td>
              <td style={{ width: '7.37%' }}>Viscosity & Wet Mill Thickness (VN)</td>
              <td style={{ width: '7.37%' }}>SPEC EN</td>
              <td style={{ width: '7.37%' }}>SPEC VN</td>
              <td style={{ width: '3.02%' }}>Hold Time (min)</td>
              <td style={{ width: '5.61%' }}>Chemical Mixing Code</td>
              <td style={{ width: '5.61%' }}>Consumption (per m2)</td>
              <td style={{ width: '6.74%' }}>Material Code</td>
              <td style={{ width: '7.51%' }}>Material Name</td>
              <td style={{ width: '3.51%' }}>Ratio</td>
              <td style={{ width: '3.51%' }}>Qty (per m2)</td>
              <td style={{ width: '3.51%' }}>Unit</td>
              <td style={{ width: '8%' }}>Check Result</td>
              <td style={{ width: '8%' }}>Correct Action</td>
              <td style={{ width: '4.49%' }}>TE-1's Name & Signature</td>
              <td style={{ width: '4.49%' }}>Customer Signature</td>
              <td style={{ width: '3%' }}>Actions</td>
            </tr>
          </thead>

          {/* Body Section */}
          <tbody>
            {finishingSheet.rows.map((record, recordIndex) => (
              <React.Fragment key={record.id}>
                {record.products.map((product, productIndex) => (
                  <tr
                    key={`${record.id}-${productIndex}`}
                    className={productIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {/* Step Number - only show on first product row */}
                    {productIndex === 0 && (
                      <td
                        
                        rowSpan={record.products.length}
                      >
                        <div>Step {record.step_num}</div>
                        Booth
                        <input
                          type="text"
                          value={record.spot || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateRecord(record.id, {
                              spot: val === '' ? null : val,
                            });
                          }}
                          className="w-full mt-1"
                          placeholder="Spot"
                        />
                      </td>
                    )}

                    {/* Step Name Dropdown - only show on first product row */}
                    {productIndex === 0 && (
                      <td 
                        
                        rowSpan={record.products.length} 
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
                          
                          rowSpan={record.products.length} 
                        >
                          {record.viscosity_en}
                        </td>
                        <td 
                          
                          rowSpan={record.products.length} 
                        >
                          {record.viscosity_vi}
                        </td>
                      </>
                    )}

                    {/* SPEC - only show on first product row */}
                    {productIndex === 0 && (
                      <>
                        <td 
                          rowSpan={record.products.length} 
                        >
                          <div>{record.spec_en}</div>
                        </td>
                        <td 
                          rowSpan={record.products.length} 
                        >
                          <div>{record.spec_vi}</div>
                        </td>
                      </>
                    )}

                    {/* Hold Time - only show on first product row */}
                    {productIndex === 0 && (
                      <td 
                        
                        rowSpan={record.products.length} 
                      >
                        {record.hold_time}
                      </td>
                    )}

                    {/* Chemical Mixing Code Dropdown - only show on first product row */}
                    {productIndex === 0 && (
                      <td 
                        
                        rowSpan={record.products.length} 
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
                        
                        rowSpan={record.products.length} 
                      >
                        {record.consumption}
                      </td>
                    )}

                    {/* Product Data - show for each product*/}
                    <td >
                      {product.product_code}
                    </td>
                    <td >
                      {product.product_name}
                    </td>
                    <td >
                      {product.ratio}
                    </td>
                    <td >
                      {product.qty}
                    </td>
                    <td >
                      {product.unit}
                    </td>
                    <td >
                      <input
                        type="text"
                        value={product.check_result}
                        onChange={(e) => updateProduct(record.id, product.id, { check_result: e.target.value })}
                        className="w-full"
                        placeholder="Check Result"
                      />
                    </td>
                    <td >
                      <input
                        type="text"
                        value={product.correct_action}
                        onChange={(e) => updateProduct(record.id, product.id, { correct_action: e.target.value })}
                        className="w-full"
                        placeholder="Correct Action"
                      />
                    </td>
                    <td >
                      <input
                        type="text"
                        value={product.te1_signature}
                        onChange={(e) => updateProduct(record.id, product.id, { te1_signature: e.target.value })}
                        className="w-full"
                        placeholder="TE-1 Signature"
                      />
                    </td>
                    <td >
                      <input
                        type="text"
                        value={product.customer_signature}
                        onChange={(e) => updateProduct(record.id, product.id, { customer_signature: e.target.value })}
                        className="w-full"
                        placeholder="Customer Signature"
                      />
                    </td>

                    {/* Actions Column */}
                    <td >
                      <div className="flex flex-col gap-1">
                        {/* Row actions - only show on first product */}
                        {productIndex === 0 && (
                          <>
                          </>
                        )}
                      </div>
                    </td>
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