'use client'
import React, { useState } from 'react';
import ReactSelect from 'react-select';
import type { StepTemplate, FormularTemplate, SheetRow, RowProduct, FinishingSheet, TaskDataDetail } from '@/types';
import { putFinishingSheet, createFinishingSheet } from '@/lib/api/client/api';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MultiSelect } from '@/components/ui/multi-select';
import { generatePDF, generateSimpleFormPDF } from '@/lib/pdf-generator';
import { MoreVertical, Plus, Trash2, FileText } from "lucide-react";
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface CombinedSheetTableProps {
  data?: FinishingSheet; // Optional for create mode
  stepTemplates: StepTemplate[];
  formularTemplates: FormularTemplate[];
  taskId: string;
  mode?: 'create' | 'edit'; // New prop to determine mode
  taskDataDetail: TaskDataDetail
}

// Generate unique ID for new records
let idCounter = 0;
const generateId = () => `temp-${(++idCounter).toString()}`;

// Function to create empty finishing sheet
const createEmptyFinishingSheet = (taskId: string, taskDataDetail: TaskDataDetail): FinishingSheet => ({
  id: generateId(),
  task: taskId,
  finishing_code: taskDataDetail.finishing_code,
  name: taskDataDetail.customer_color_name || taskDataDetail.finishing_code,
  sheen: taskDataDetail.sheen_level,
  dft: '250',
  type_of_paint: taskDataDetail.type_of_paint,
  type_of_substrate: taskDataDetail.type_of_substrate,
  finishing_surface_grain: taskDataDetail.finishing_surface_grain,
  sampler: taskDataDetail.sampler,
  chemical_waste: '0%',
  conveyor_speed: '1.5 METER PER MINUTE',
  with_panel_test: false,
  testing: false,
  chemical_yellowing: false,
  created_at: new Date().toISOString(),
  created_by: {
    id: '',
    username: '',
    first_name: '',
    last_name: ''
  },
  updated_at: new Date().toISOString(),
  updated_by: {
    id: '',
    username: '',
    first_name: '',
    last_name: ''
  },
  rows: []
});

// Main Component
const CombinedSheetTable: React.FC<CombinedSheetTableProps> = ({ 
  data,
  stepTemplates, 
  formularTemplates,
  taskId,
  mode,
  taskDataDetail
}) => {
  // Initialize with provided data or empty sheet for create mode
  const [finishingSheet, setFinishingSheet] = useState<FinishingSheet>(
    data || createEmptyFinishingSheet(taskId, taskDataDetail)
  );

  const [isSaving, setIsSaving] = useState(false);
  const [languageSettings, setLanguageSettings] = useState({
    en: false,
    vi: true,
    zh_hant: true
  });
  const router = useRouter();
  const t = useTranslations();

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

  const calculateProductQuantities = (consumption: string, products: RowProduct[]): RowProduct[] => {
    const consumptionValue = parseFloat(consumption) || 0;
    const totalRatio = products.reduce((sum, product) => sum + (parseFloat(product.ratio) || 0), 0);
    
    return products.map(product => {
      const ratio = parseFloat(product.ratio) || 0;
      const qty = totalRatio > 0 ? ((consumptionValue * ratio) / totalRatio).toFixed(3) : '0';
      return { ...product, qty };
    });
  };

  // Helper function to recalculate step numbers after row operations
  const recalculateStepNumbers = (rows: SheetRow[]): SheetRow[] => {
    return rows.map((row, index) => ({
      ...row,
      step_num: index + 1
    }));
  };

  // Create empty product
  const makeEmptyProduct = (): RowProduct => ({
    id: generateId(),
    order: 1,
    product_code: '',
    product_name: '',
    product_type_en: '',
    product_type_vi: '',
    product_type_zh_hant: '',
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
      stepname_short_en: '',
      stepname_short_vi: '',
      stepname_short_zh_hant: '',
      sanding_en: '',
      sanding_vi: '',
      sanding_zh_hant: '',
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
    setFinishingSheet(prev => {
      const filteredRows = prev.rows.filter(row => row.id !== rowId);
      // Recalculate step numbers after removal
      const updatedRows = recalculateStepNumbers(filteredRows);
      
      return {
        ...prev,
        rows: updatedRows
      };
    });
  };

  const addRowBefore = (targetRowId: string) => {
    const targetIndex = finishingSheet.rows.findIndex(row => row.id === targetRowId);
    if (targetIndex === -1) return;

    const newRow: SheetRow = {
      id: generateId(),
      step_template: null,
      formular_template: null,
      step_num: targetIndex + 1, // Will be recalculated
      spot: null,
      stepname_en: '',
      stepname_vi: '',
      stepname_zh_hant: '',
      viscosity_en: '',
      viscosity_vi: '',
      viscosity_zh_hant: '',
      stepname_short_en: '',
      stepname_short_vi: '',
      stepname_short_zh_hant: '',
      sanding_en: '',
      sanding_vi: '',
      sanding_zh_hant: '',
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

    setFinishingSheet(prev => {
      const newRows = [
        ...prev.rows.slice(0, targetIndex),
        newRow,
        ...prev.rows.slice(targetIndex)
      ];
      
      // Recalculate step numbers after insertion
      const updatedRows = recalculateStepNumbers(newRows);
      
      return {
        ...prev,
        rows: updatedRows
      };
    });
  };

  // Add row after specified row
  const addRowAfter = (targetRowId: string) => {
    const targetIndex = finishingSheet.rows.findIndex(row => row.id === targetRowId);
    if (targetIndex === -1) return;

    const newRow: SheetRow = {
      id: generateId(),
      step_template: null,
      formular_template: null,
      step_num: targetIndex + 2, // Will be recalculated
      spot: null,
      stepname_en: '',
      stepname_vi: '',
      stepname_zh_hant: '',
      viscosity_en: '',
      viscosity_vi: '',
      viscosity_zh_hant: '',
      stepname_short_en: '',
      stepname_short_vi: '',
      stepname_short_zh_hant: '',
      sanding_en: '',
      sanding_vi: '',
      sanding_zh_hant: '',
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

    setFinishingSheet(prev => {
      const newRows = [
        ...prev.rows.slice(0, targetIndex + 1),
        newRow,
        ...prev.rows.slice(targetIndex + 1)
      ];
      
      // Recalculate step numbers after insertion
      const updatedRows = recalculateStepNumbers(newRows);
      
      return {
        ...prev,
        rows: updatedRows
      };
    });
  };

  // Handle step template dropdown change
  const handleStepChange = (recordId: string, stepTemplateId: string) => {
    const step = stepTemplates.find(s => s.id === stepTemplateId);
    if (!step) return;

    setFinishingSheet(prev => ({
      ...prev,
      rows: prev.rows.map(record => 
        record.id === recordId 
          ? {
              ...record,
              step_template: step.id,
              stepname_en: step.name_en,
              stepname_vi: step.name_vi,
              stepname_zh_hant: step.name_zh_hant,
              stepname_short_en: step.short_name_en,
              stepname_short_vi: step.short_name_vi,
              stepname_short_zh_hant: step.short_name_zh_hant,
              sanding_en: step.sanding_en,
              sanding_vi: step.sanding_vi,
              sanding_zh_hant: step.sanding_zh_hant,
              spec_en: step.spec_en || '',
              spec_vi: step.spec_vi || '',
              spec_zh_hant: step.spec_zh_hant || '',
              hold_time: step.hold_time?.toString() || '',
              consumption: step.consumption,
              // Recalculate quantities with new consumption
              products: calculateProductQuantities(step.consumption, record.products)
            }
          : record
      )
    }));
  };

  // Handle formular template dropdown change
  const handleFormularChange = (recordId: string, formularTemplateId: string) => {
    const formular = formularTemplates.find(f => f.id === formularTemplateId);
    if (!formular) return;

    // Get current row to access its consumption value
    const currentRow = finishingSheet.rows.find(row => row.id === recordId);
    const currentConsumption = currentRow?.consumption || '0';

    const products: RowProduct[] = formular.products.map((product, idx) => ({
      id: generateId(),
      order: idx + 1,
      product_code: product.code,
      product_name: product.name,
      product_type_en: product.type_en,
      product_type_vi: product.type_vi,
      product_type_zh_hant: product.type_zh_hant,
      ratio: product.ratio?.toString() || '0',
      qty: '0', // Will be calculated below
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

    // Calculate quantities for the new products
    const productsWithQty = calculateProductQuantities(currentConsumption, products);

    updateRecord(recordId, {
      formular_template: formular.id,
      chemical_code: formular.code,
      viscosity_en: formular.viscosity ? `${formular.viscosity} secs` : '',
      viscosity_vi: formular.viscosity ? `${formular.viscosity} giây` : '',
      viscosity_zh_hant: formular.viscosity ? `${formular.viscosity} 秒` : '',

      products: productsWithQty.length > 0 ? productsWithQty : [makeEmptyProduct()],
    });
  };

  // Create options for dropdowns
  const stepOptions = stepTemplates.map(step => ({
    value: step.id.toString(),
    label: step.short_name,
    searchValue: `${step.short_name} ${step.name || ''}`.trim()
  }));

  const formularOptions = formularTemplates.map(formular => ({
    value: formular.id.toString(),
    label: formular.code,
    searchValue: `${formular.code}`.trim()
  }));

  // Save function - handles both create and update
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      
      if (mode === 'create') {
        // Create new finishing sheet
        await createFinishingSheet(taskId, finishingSheet);
        alert('Finishing sheet created successfully');
        router.push(`/task-management/tasks/${taskId}/sheets`);
      } else {
        // Update existing finishing sheet
        await putFinishingSheet(taskId, finishingSheet.id, finishingSheet);
        alert('Finishing sheet saved successfully');
        router.refresh()
      }
      
    } catch (error) {
      alert(`Error ${mode === 'create' ? 'creating' : 'saving'} finishing sheet`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={addRow}>
            {t('common.addRow')}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? t('common.processing') : (mode === 'create' ? t('common.create') : t('common.save'))}
          </Button>
        </div>
        <div className="flex gap-2">
          <div className="min-w-0">
            <MultiSelect
              options={[
                { value: 'en', label: 'English' },
                { value: 'vi', label: 'Tiếng Việt' },
                { value: 'zh_hant', label: '繁體中文' }
              ]}
              onValueChange={(selectedLanguages) => {
                const newLanguageSettings = {
                  en: selectedLanguages.includes('en'),
                  vi: selectedLanguages.includes('vi'),
                  zh_hant: selectedLanguages.includes('zh_hant')
                };
                setLanguageSettings(newLanguageSettings);
              }}
              defaultValue={['vi', 'zh_hant']}
              disabled={false}
              responsive={true}
              modalPopover={true}
              maxCount={2}
            />
          </div>
          <Button
            onClick={() => generateSimpleFormPDF(
              finishingSheet, 
              taskDataDetail,
              languageSettings.en, 
              languageSettings.vi, 
              languageSettings.zh_hant
            )}
            variant="outline"
            disabled={finishingSheet.rows.length === 0}
          >
            <FileText size={16} />
            {t('common.generateSimplePDF')}
          </Button>
          <Button
            onClick={() => generatePDF(finishingSheet)}
            variant="outline"
            disabled={finishingSheet.rows.length === 0}
          >
            <FileText size={16} />
            {t('common.generatePDF')}
          </Button>
        </div>
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
                  <strong>{t('finishingSheet.name')}:</strong> 
                  <input
                    type="text"
                    value={finishingSheet.name}
                    onChange={(e) => updateFinishingSheet({ name: e.target.value })}
                    className="ml-1 px-1"
                  />
                  <br/>
                  <strong>{t('finishingSheet.sheen')}:</strong> 
                  <input
                    type="text"
                    value={finishingSheet.sheen}
                    onChange={(e) => updateFinishingSheet({ sheen: e.target.value })}
                    className="ml-1 px-1"
                  />
                  <br/>
                  <strong>{t('finishingSheet.dft')}:</strong> 
                  <input
                    type="text"
                    value={finishingSheet.dft}
                    onChange={(e) => updateFinishingSheet({ dft: e.target.value })}
                    className="ml-1 px-1"
                  />
                  <br/>
                  <strong>{t('finishingSheet.typeOfPaint')}:</strong> 
                  <input
                    type="text"
                    value={finishingSheet.type_of_paint}
                    onChange={(e) => updateFinishingSheet({ type_of_paint: e.target.value })}
                    className="ml-1 px-1"
                  />
                  <br/>
                  <strong>{t('finishingSheet.typeOfSubstrate')}:</strong> 
                  <input
                    type="text"
                    value={finishingSheet.type_of_substrate}
                    onChange={(e) => updateFinishingSheet({ type_of_substrate: e.target.value })}
                    className="ml-1 px-1"
                  />
                  <br/>
                  <strong>{t('finishingSheet.finishingSurfaceGrain')}:</strong> 
                  <input
                    type="text"
                    value={finishingSheet.finishing_surface_grain}
                    onChange={(e) => updateFinishingSheet({ finishing_surface_grain: e.target.value })}
                    className="ml-1 px-1"
                  />
                  <br/>
                  <strong>{t('finishingSheet.sampler')}:</strong> 
                  <input
                    type="text"
                    value={finishingSheet.sampler}
                    onChange={(e) => updateFinishingSheet({ sampler: e.target.value })}
                    className="ml-1 px-1"
                  />
                </div>
              </td>
              <td colSpan={1}>
                <strong>{t('finishingSheet.chemicalWaste')}:</strong> 
                <input
                  type="text"
                  value={finishingSheet.chemical_waste}
                  onChange={(e) => updateFinishingSheet({ chemical_waste: e.target.value })}
                  className="ml-1 px-1 w-full"
                />
                <br/><br/>
                <strong>{t('finishingSheet.conveyorSpeed')}:</strong> 
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
                <strong>{t('finishingSheet.withPanelTest')}:</strong> 
                <input
                  type="checkbox"
                  checked={finishingSheet.with_panel_test}
                  onChange={(e) => updateFinishingSheet({ with_panel_test: e.target.checked })}
                  className="ml-1"
                />
                <br/>
                <strong>{t('finishingSheet.noPanelTest')}:</strong> 
                <input
                  type="checkbox"
                  checked={!finishingSheet.with_panel_test}
                  onChange={(e) => updateFinishingSheet({ with_panel_test: !e.target.checked })}
                  className="ml-1"
                />
                <br/>
                <strong>{t('finishingSheet.testing')}:</strong> 
                <input
                  type="checkbox"
                  checked={finishingSheet.testing}
                  onChange={(e) => updateFinishingSheet({ testing: e.target.checked })}
                  className="ml-1"
                />
                <br/>
                <strong>{t('finishingSheet.chemicalYellowing')}:</strong> 
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
                <div className="font-bold">{t('finishingSheet.dailyCheckList')}</div>
                <div>Date: _______________</div>
              </td>
            </tr>

            {/* Column Headers Row */}
            <tr className="font-bold text-center">
              <td style={{ width: '2.39%' }}>{t('finishingSheet.step')}</td>
              <td style={{ width: '4.14%' }}>{t('finishingSheet.stepName')}</td>
              <td style={{ width: '7.37%' }}>{t('finishingSheet.viscosity_en')}</td>
              <td style={{ width: '7.37%' }}>{t('finishingSheet.viscosity_vi')}</td>
              <td style={{ width: '7.37%' }}>{t('finishingSheet.spec_en')}</td>
              <td style={{ width: '7.37%' }}>{t('finishingSheet.spec_vi')}</td>
              <td style={{ width: '3.02%' }}>{t('finishingSheet.holdTime')}</td>
              <td style={{ width: '5.61%' }}>{t('finishingSheet.chemicalCode')}</td>
              <td style={{ width: '5.61%' }}>{t('finishingSheet.consumption')}</td>
              <td style={{ width: '6.74%' }}>{t('finishingSheet.productCode')}</td>
              <td style={{ width: '7.51%' }}>{t('finishingSheet.productName')}</td>
              <td style={{ width: '3.51%' }}>{t('finishingSheet.ratio')}</td>
              <td style={{ width: '3.51%' }}>{t('finishingSheet.qty')}</td>
              <td style={{ width: '3.51%' }}>{t('finishingSheet.unit')}</td>
              <td style={{ width: '8%' }}>{t('finishingSheet.checkResult')}</td>
              <td style={{ width: '8%' }}>C{t('finishingSheet.correctAction')}</td>
              <td style={{ width: '4.49%' }}>{t('finishingSheet.te1Sign')}</td>
              <td style={{ width: '4.49%' }}>{t('finishingSheet.customerSign')}</td>
              <td style={{ width: '3%' }}>{t('finishingSheet.actions')}</td>
            </tr>
          </thead>

          {/* Body Section */}
          <tbody>
            {finishingSheet.rows.length === 0 ? (
              <tr>
                <td colSpan={19} className="text-center py-8 text-gray-500">
                  {t('finishingSheet.noRow')}
                </td>
              </tr>
            ) : (
            finishingSheet.rows.map((record) => (
              <React.Fragment key={record.id}>
                {record.products.map((product, productIndex) => (
                  <tr
                    key={`${record.id}-${productIndex}`}
                    className={productIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {/* Step Number - only show on first product row */}
                    {productIndex === 0 && (
                      <td rowSpan={record.products.length}>
                        <div>{t('finishingSheet.step')} {record.step_num}</div>
                        {t('finishingSheet.booth')}
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
                      <td rowSpan={record.products.length}>
                        <ReactSelect
                          options={stepOptions}
                          value={stepOptions.find(option => option.value === record.step_template?.toString()) || null}
                          onChange={(selectedOption) => handleStepChange(record.id, selectedOption?.value || "")}
                          noOptionsMessage={() => t('common.noDataFound')}
                          isSearchable={true}
                          isClearable={true}
                        />
                      </td>
                    )}

                    {/* Viscosity & Wet Mill Thickness - only show on first product row */}
                    {productIndex === 0 && (
                      <>
                        <td rowSpan={record.products.length}>
                          {record.viscosity_en}
                        </td>
                        <td rowSpan={record.products.length}>
                          {record.viscosity_vi}
                        </td>
                      </>
                    )}

                    {/* SPEC - only show on first product row */}
                    {productIndex === 0 && (
                      <>
                        <td rowSpan={record.products.length}>
                          <div>{record.spec_en}</div>
                        </td>
                        <td rowSpan={record.products.length}>
                          <div>{record.spec_vi}</div>
                        </td>
                      </>
                    )}

                    {/* Hold Time - only show on first product row */}
                    {productIndex === 0 && (
                      <td rowSpan={record.products.length}>
                        {record.hold_time}
                      </td>
                    )}

                    {/* Chemical Mixing Code Dropdown - only show on first product row */}
                    {productIndex === 0 && (
                      <td rowSpan={record.products.length}>
                        <ReactSelect
                          options={formularOptions}
                          value={formularOptions.find(option => option.value === record.formular_template?.toString()) || null}
                          onChange={(selectedOption) => handleFormularChange(record.id, selectedOption?.value || "")}
                          noOptionsMessage={() => t('common.noDataFound')}
                          isSearchable={true}
                          isClearable={true}
                        />
                      </td>
                    )}

                    {/* Consumption - only show on first product row */}
                    {productIndex === 0 && (
                      <td rowSpan={record.products.length}>
                        {record.consumption}
                      </td>
                    )}

                    {/* Product Data - show for each product*/}
                    <td>{product.product_code}</td>
                    <td>{product.product_name}</td>
                    <td>{product.ratio}</td>
                    <td>{product.qty}</td>
                    <td>{product.unit}</td>
                    <td>
                      <input
                        type="text"
                        value={product.check_result}
                        onChange={(e) => updateProduct(record.id, product.id, { check_result: e.target.value })}
                        className="w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={product.correct_action}
                        onChange={(e) => updateProduct(record.id, product.id, { correct_action: e.target.value })}
                        className="w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={product.te1_signature}
                        onChange={(e) => updateProduct(record.id, product.id, { te1_signature: e.target.value })}
                        className="w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={product.customer_signature}
                        onChange={(e) => updateProduct(record.id, product.id, { customer_signature: e.target.value })}
                        className="w-full"
                      />
                    </td>

                    {/* Actions Column */}
                    {productIndex === 0 && (
                      <td rowSpan={record.products.length}>
                        <div className="flex flex-col gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => addRowBefore(record.id)}>
                                <Plus className="mr-2 h-4 w-4" />
                                {t('common.addRowBefore')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => addRowAfter(record.id)}>
                                <Plus className="mr-2 h-4 w-4" />
                                {t('common.addRowAfter')}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => removeRow(record.id)}
                                disabled={finishingSheet.rows.length <= 1}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('common.removeRow')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CombinedSheetTable;