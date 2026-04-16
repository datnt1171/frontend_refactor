'use client'
import React, { useState } from 'react';
import ReactSelect from 'react-select';
import type { StepTemplate, FormularTemplate, SheetRow, RowProduct, FinishingSheet, TaskDataDetail } from '@/types';
import { createFinishingSheetWithImages, putFinishingSheetWithImages } from '@/lib/api/client/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import PDFGeneratorButton from './PDFGeneratorButton';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface CombinedSheetTableProps {
  data?: FinishingSheet;
  stepTemplates: StepTemplate[];
  formularTemplates: FormularTemplate[];
  taskId: string;
  mode?: 'create' | 'edit';
  taskDataDetail: TaskDataDetail;
}

let idCounter = 0;
const generateId = () => `temp-${(++idCounter).toString()}`;

const createEmptyFinishingSheet = (taskId: string, td: TaskDataDetail): FinishingSheet => ({
  id: generateId(),
  task: taskId,
  factory_code: td.factory_code || '',
  finishing_code: td.finishing_code,
  retailer_id: td.retailer_id || '',
  customer_color_name: td.customer_color_name || '',
  sample_type: td.sample_type || '',
  type_of_substrate: td.type_of_substrate,
  collection: td.collection || '',
  sampler: td.sampler,
  type_of_paint: td.type_of_paint,
  finishing_surface_grain: td.finishing_surface_grain,
  sheen_level: td.sheen_level,
  substrate_surface_treatment: td.substrate_surface_treatment || '',
  panel_category: td.panel_category || '',
  purpose_of_usage: td.purpose_of_usage || '',
  furniture_type: '',
  dft: '250',
  chemical_waste: '0%',
  conveyor_speed: '1.5 METER PER MINUTE',
  color: '',
  images: null,
  with_panel_test: false,
  testing: false,
  chemical_yellowing: false,
  created_at: new Date().toISOString(),
  created_by: { id: '', username: '', first_name: '', last_name: '' },
  updated_at: new Date().toISOString(),
  updated_by: { id: '', username: '', first_name: '', last_name: '' },
  rows: [],
});

const makeEmptyProduct = (): RowProduct => ({
  id: generateId(),
  order: 1,
  product_code: '',
  product_name: '',
  product_description_en: '',
  product_description_vi: '',
  product_description_zh_hant: '',
  ratio: '',
  qty: '',
  unit: '',
  created_by: '',
  created_at: new Date().toISOString(),
  updated_by: '',
  updated_at: new Date().toISOString(),
});

const makeEmptyRow = (): SheetRow => ({
  id: generateId(),
  step_template: null,
  formular_template: null,
  order: 0,
  spot: null,
  name_en: '', name_vi: '', name_zh_hant: '',
  name_short_en: '', name_short_vi: '', name_short_zh_hant: '',
  sanding_en: '', sanding_vi: '', sanding_zh_hant: '',
  viscosity_en: '', viscosity_vi: '', viscosity_zh_hant: '',
  spec_en: '', spec_vi: '', spec_zh_hant: '',
  hold_time: '', chemical_code: '', consumption: '', wft: '', oven_temperature: '',
  created_at: new Date().toISOString(), created_by: '',
  updated_at: new Date().toISOString(), updated_by: '',
  products: [makeEmptyProduct()],
});



const calculateProductQuantities = (consumption: string, products: RowProduct[]): RowProduct[] => {
  const consumptionValue = parseFloat(consumption) || 0;
  const totalRatio = products.reduce((sum, p) => sum + parseFloat(p.ratio ?? '0'), 0);
  return products.map(p => ({
    ...p,
    qty: totalRatio > 0 ? ((consumptionValue * parseFloat(p.ratio ?? '0')) / totalRatio).toFixed(3) : '0'
  }));
};

// Compact field: label on top, full-width input below
const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5 min-w-0">
    <Label className="text-[11px] text-muted-foreground leading-none truncate">{label}</Label>
    {children}
  </div>
);

export default function CombinedSheetTable({
  data, stepTemplates, formularTemplates, taskId, mode, taskDataDetail
}: CombinedSheetTableProps) {
  const [sheet, setSheet] = useState<FinishingSheet>(data || createEmptyFinishingSheet(taskId, taskDataDetail));
  const [isSaving, setIsSaving] = useState(false);
  const [collapsedRows, setCollapsedRows] = useState<Set<string>>(new Set());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    data?.images ? (typeof data.images === 'string' ? data.images : null) : null
  );
  const [newImages, setNewImages] = useState<File[]>([])
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])
  const router = useRouter();
  const t = useTranslations();

  const updateSheet = (updates: Partial<FinishingSheet>) => setSheet(prev => ({ ...prev, ...updates }));
  const recalcOrder = (rows: SheetRow[]) => rows.map((r, i) => ({ ...r, order: i + 1 }));
  const addRow = () => setSheet(prev => ({ ...prev, rows: recalcOrder([...prev.rows, makeEmptyRow()]) }));
  const removeRow = (id: string) => setSheet(prev => ({ ...prev, rows: recalcOrder(prev.rows.filter(r => r.id !== id)) }));
  const updateRow = (id: string, updates: Partial<SheetRow>) =>
    setSheet(prev => ({ ...prev, rows: prev.rows.map(r => r.id === id ? { ...r, ...updates } : r) }));

  const addProduct = (rowId: string) => setSheet(prev => ({
    ...prev,
    rows: prev.rows.map(r => r.id === rowId
      ? { ...r, products: [...r.products, { ...makeEmptyProduct(), order: r.products.length + 1 }] }
      : r)
  }));

  const removeProduct = (rowId: string, productId: string) => setSheet(prev => ({
    ...prev,
    rows: prev.rows.map(r => r.id === rowId
      ? { ...r, products: r.products.filter(p => p.id !== productId).map((p, i) => ({ ...p, order: i + 1 })) }
      : r)
  }));

  const updateProduct = (rowId: string, productId: string, updates: Partial<RowProduct>) =>
    setSheet(prev => ({
      ...prev,
      rows: prev.rows.map(r => r.id === rowId
        ? { ...r, products: calculateProductQuantities(r.consumption ?? '0', r.products.map(p => p.id === productId ? { ...p, ...updates } : p)) }
        : r)
    }));

  const handleStepChange = (rowId: string, stepId: string) => {
    const step = stepTemplates.find(s => s.id === stepId);
    if (!step) return;
    updateRow(rowId, {
      step_template: step.id,
      name_en: step.name_en, name_vi: step.name_vi, name_zh_hant: step.name_zh_hant,
      name_short_en: step.short_name_en, name_short_vi: step.short_name_vi, name_short_zh_hant: step.short_name_zh_hant,
      sanding_en: step.sanding_en, sanding_vi: step.sanding_vi, sanding_zh_hant: step.sanding_zh_hant,
      spec_en: step.spec_en || '', spec_vi: step.spec_vi || '', spec_zh_hant: step.spec_zh_hant || '',
      hold_time: step.hold_time?.toString() || '',
      oven_temperature: step.oven_temperature || '',
      consumption: step.consumption,
    });
  };

  const handleFormularChange = (rowId: string, formularId: string) => {
    const formular = formularTemplates.find(f => f.id === formularId);
    if (!formular) return;
    const currentConsumption = sheet.rows.find(r => r.id === rowId)?.consumption || '0';
    const products: RowProduct[] = formular.products.map((p, idx) => ({
      id: generateId(), order: idx + 1,
      product_code: p.code, product_name: p.name,
      product_description_en: p.description_en,
      product_description_vi: p.description_vi,
      product_description_zh_hant: p.description_zh_hant,
      ratio: p.ratio?.toString() || '0', qty: '0', unit: p.unit || '',
      created_by: '', created_at: new Date().toISOString(),
      updated_by: '', updated_at: new Date().toISOString(),
    }));
    updateRow(rowId, {
      formular_template: formular.id,
      chemical_code: formular.code,
      wft: formular.wft || '',
      viscosity_en: formular.viscosity ? `${formular.viscosity} secs` : '',
      viscosity_vi: formular.viscosity ? `${formular.viscosity} giây` : '',
      viscosity_zh_hant: formular.viscosity ? `${formular.viscosity} 秒` : '',
      products: calculateProductQuantities(currentConsumption, products.length > 0 ? products : [makeEmptyProduct()]),
    });
  };

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (mode === 'create') {
        await createFinishingSheetWithImages(taskId, sheet, newImages)
        router.push(`/task-management/tasks/${taskId}/sheets`)
      } else {
        await putFinishingSheetWithImages(taskId, sheet.id, sheet, newImages, deletedImageIds)
        router.push(`/task-management/tasks/${taskId}/sheets`)
      }
    } catch {
      alert(`Error ${mode === 'create' ? 'creating' : 'saving'} finishing sheet`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setNewImages(prev => [...prev, ...files])
  }

  const handleImageDelete = (imageId: string) => {
    setDeletedImageIds(prev => [...prev, imageId])
  }

  const handleNewImageRemove = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
  }

  const stepOptions = stepTemplates.map(s => ({ value: s.id.toString(), label: `${s.short_name} — ${s.name}` }));
  const formularOptions = formularTemplates.map(f => ({ value: f.id.toString(), label: f.code }));
  const toggleCollapse = (id: string) => setCollapsedRows(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const inputCls = "h-7 text-xs px-1.5";
  const selectStyles = {
    control: (b: object) => ({ ...b, minHeight: '28px', height: '28px', fontSize: '12px' }),
    valueContainer: (b: object) => ({ ...b, padding: '0 6px' }),
    indicatorsContainer: (b: object) => ({ ...b, height: '28px' }),
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    
    <div className="space-y-2 p-2">
      <div className="flex gap-2">
        <Button size="sm" className="h-7 text-xs" onClick={handleSave} disabled={isSaving}>
          {isSaving ? t('common.processing') : (mode === 'create' ? t('common.create') : t('common.save'))}
        </Button>
        <PDFGeneratorButton                        // ← add this
          sheet={sheet}
          taskDataDetail={taskDataDetail}
          disabled={sheet.rows.length === 0}
        />
      </div>
      {/* ── Sheet Info ── */}
      <Card className="border shadow-none">
        <CardHeader className="py-1.5 px-3 border-b">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sheet Info</span>
        </CardHeader>
        <CardContent className="p-3 space-y-2">
          {/* 2 cols mobile → 4 cols desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <F label="Finishing Code">
              <Input className={inputCls} value={sheet.finishing_code} onChange={e => updateSheet({ finishing_code: e.target.value })} />
            </F>
            <F label="Factory Code">
              <Input className={inputCls} value={sheet.factory_code} onChange={e => updateSheet({ factory_code: e.target.value })} />
            </F>
            <F label="Customer Color">
              <Input className={inputCls} value={sheet.customer_color_name} onChange={e => updateSheet({ customer_color_name: e.target.value })} />
            </F>
            <F label="Sheen Level">
              <Input className={inputCls} value={sheet.sheen_level} onChange={e => updateSheet({ sheen_level: e.target.value })} />
            </F>
            <F label="Type of Paint">
              <Input className={inputCls} value={sheet.type_of_paint} onChange={e => updateSheet({ type_of_paint: e.target.value })} />
            </F>
            <F label="Type of Substrate">
              <Input className={inputCls} value={sheet.type_of_substrate} onChange={e => updateSheet({ type_of_substrate: e.target.value })} />
            </F>
            <F label="Surface Grain">
              <Input className={inputCls} value={sheet.finishing_surface_grain} onChange={e => updateSheet({ finishing_surface_grain: e.target.value })} />
            </F>
            <F label="Sampler">
              <Input className={inputCls} value={sheet.sampler} onChange={e => updateSheet({ sampler: e.target.value })} />
            </F>
            <F label="DFT">
              <Input className={inputCls} value={sheet.dft} onChange={e => updateSheet({ dft: e.target.value })} />
            </F>
            <F label="Furniture Type">
              <Input className={inputCls} value={sheet.furniture_type} onChange={e => updateSheet({ furniture_type: e.target.value })} />
            </F>
            <F label="Chemical Waste">
              <Input className={inputCls} value={sheet.chemical_waste} onChange={e => updateSheet({ chemical_waste: e.target.value })} />
            </F>
            <F label="Conveyor Speed">
              <Input className={inputCls} value={sheet.conveyor_speed} onChange={e => updateSheet({ conveyor_speed: e.target.value })} />
            </F>
          </div>

          <Separator className="my-1" />
          
          <div className="flex flex-wrap gap-2 items-start">
            {/* Existing images (from backend) */}
            {sheet.images
              ?.filter(img => !deletedImageIds.includes(img.id))
              .map(img => (
                <div key={img.id} className="relative inline-block">
                  <a href={img.image} target="_blank" rel="noopener noreferrer">
                    <img
                      src={img.image}
                      alt={img.caption || 'Sheet image'}
                      className="h-14 w-14 object-cover rounded border hover:opacity-80 transition-opacity"
                    />
                  </a>
                  <button
                    onClick={() => handleImageDelete(img.id)}
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-white text-[10px] flex items-center justify-center hover:opacity-80"
                  >
                    ×
                  </button>
                </div>
              ))
            }

            {/* Newly picked files (not yet uploaded) */}
            {newImages.map((file, index) => (
              <div key={index} className="relative inline-block">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-14 w-14 object-cover rounded border opacity-60"
                />
                {/* Dashed border indicates pending upload */}
                <div className="absolute inset-0 rounded border-2 border-dashed border-primary pointer-events-none" />
                <button
                  onClick={() => handleNewImageRemove(index)}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-white text-[10px] flex items-center justify-center hover:opacity-80"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Upload input */}
            <label className="h-14 w-14 rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary transition-colors shrink-0">
              <Plus className="h-4 w-4 text-muted-foreground" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageAdd}
                className="hidden"
              />
            </label>
          </div>

          <Separator className="my-1" />

          <div className="flex flex-wrap gap-4">
            {([
              ['with_panel_test', 'With Panel Test'],
              ['testing', 'Testing'],
              ['chemical_yellowing', 'Chemical Yellowing'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-1.5 cursor-pointer">
                <Checkbox
                  id={key}
                  checked={sheet[key] as boolean}
                  onCheckedChange={val => updateSheet({ [key]: val })}
                  className="h-3.5 w-3.5"
                />
                <span className="text-xs">{label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Rows ── */}
      {sheet.rows.map((row) => {
        const collapsed = collapsedRows.has(row.id);
        return (
          <Card key={row.id} className="border shadow-none border-l-2 border-l-primary rounded-sm">
            {/* Row header */}
            <div className="flex items-center justify-between px-2 py-1 border-b bg-muted/40">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-xs font-bold text-muted-foreground shrink-0">#{row.order}</span>
                <span className="text-xs font-medium truncate">
                  {row.name_en || <span className="text-muted-foreground italic">No step</span>}
                </span>
                {row.chemical_code && (
                  <span className="text-[10px] bg-muted border px-1 rounded shrink-0">{row.chemical_code}</span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleCollapse(row.id)}>
                  {collapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  onClick={() => removeRow(row.id)} disabled={sheet.rows.length <= 1}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {!collapsed && (
              <CardContent className="p-2 space-y-2">
                {/* Template selectors — 1 col mobile, 2 col desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <F label="Step Template">
                    <ReactSelect
                      options={stepOptions}
                      value={stepOptions.find(o => o.value === row.step_template?.toString()) || null}
                      onChange={sel => sel && handleStepChange(row.id, sel.value)}
                      placeholder="Select step..."
                      isClearable isSearchable
                      styles={selectStyles}
                    />
                  </F>
                  <F label="Formula Template">
                    <ReactSelect
                      options={formularOptions}
                      value={formularOptions.find(o => o.value === row.formular_template?.toString()) || null}
                      onChange={sel => sel && handleFormularChange(row.id, sel.value)}
                      placeholder="Select formula..."
                      isClearable isSearchable
                      styles={selectStyles}
                    />
                  </F>
                </div>

                <Separator className="my-1" />

                {/* Step fields — 2 col mobile → 4 col desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  <F label="Name (EN)">
                    <Input className={inputCls} value={row.name_en} onChange={e => updateRow(row.id, { name_en: e.target.value })} />
                  </F>
                  <F label="Name (VI)">
                    <Input className={inputCls} value={row.name_vi} onChange={e => updateRow(row.id, { name_vi: e.target.value })} />
                  </F>
                  <F label="Name (ZH)">
                    <Input className={inputCls} value={row.name_zh_hant} onChange={e => updateRow(row.id, { name_zh_hant: e.target.value })} />
                  </F>
                  <F label="Short (EN)">
                    <Input className={inputCls} value={row.name_short_en} onChange={e => updateRow(row.id, { name_short_en: e.target.value })} />
                  </F>
                  <F label="Short (VI)">
                    <Input className={inputCls} value={row.name_short_vi} onChange={e => updateRow(row.id, { name_short_vi: e.target.value })} />
                  </F>
                  <F label="Short (ZH)">
                    <Input className={inputCls} value={row.name_short_zh_hant} onChange={e => updateRow(row.id, { name_short_zh_hant: e.target.value })} />
                  </F>
                  <F label="Viscosity (EN)">
                    <Input className={inputCls} value={row.viscosity_en} onChange={e => updateRow(row.id, { viscosity_en: e.target.value })} />
                  </F>
                  <F label="Viscosity (VI)">
                    <Input className={inputCls} value={row.viscosity_vi} onChange={e => updateRow(row.id, { viscosity_vi: e.target.value })} />
                  </F>
                  <F label="Viscosity (ZH)">
                    <Input className={inputCls} value={row.viscosity_zh_hant} onChange={e => updateRow(row.id, { viscosity_zh_hant: e.target.value })} />
                  </F>
                  <F label="Spec (EN)">
                    <Input className={inputCls} value={row.spec_en} onChange={e => updateRow(row.id, { spec_en: e.target.value })} />
                  </F>
                  <F label="Spec (VI)">
                    <Input className={inputCls} value={row.spec_vi} onChange={e => updateRow(row.id, { spec_vi: e.target.value })} />
                  </F>
                  <F label="Spec (ZH)">
                    <Input className={inputCls} value={row.spec_zh_hant} onChange={e => updateRow(row.id, { spec_zh_hant: e.target.value })} />
                  </F>
                  {/* remaining single fields stay in the same grid */}
                  <F label="Hold Time">
                    <Input className={inputCls} value={row.hold_time} onChange={e => updateRow(row.id, { hold_time: e.target.value })} />
                  </F>
                  <F label="Oven Temp">
                    <Input className={inputCls} value={row.oven_temperature} onChange={e => updateRow(row.id, { oven_temperature: e.target.value })} />
                  </F>
                  <F label="Consumption">
                    <Input className={inputCls} value={row.consumption}
                      onChange={e => updateRow(row.id, {
                        consumption: e.target.value,
                        products: calculateProductQuantities(e.target.value, row.products)
                      })} />
                  </F>
                  <F label="WFT">
                    <Input className={inputCls} value={row.wft} onChange={e => updateRow(row.id, { wft: e.target.value })} />
                  </F>
                  <F label="Chemical Code">
                    <Input className={inputCls} value={row.chemical_code} onChange={e => updateRow(row.id, { chemical_code: e.target.value })} />
                  </F>
                  <F label="Spot">
                    <Input className={inputCls} value={row.spot ?? ''} onChange={e => updateRow(row.id, { spot: e.target.value || null })} />
                  </F>
                </div>

                <Separator className="my-1" />

                {/* Products */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Products</span>
                    <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={() => addProduct(row.id)}>
                      <Plus className="h-3 w-3 mr-1" />Add
                    </Button>
                  </div>

                  {/* Product header — hidden on mobile, shown on sm+ */}
                  <div className="hidden sm:grid sm:grid-cols-[2fr_2fr_1fr_2fr_1fr_1fr_1fr_28px] gap-1 px-1 text-[10px] text-muted-foreground">
                    <span>Code</span><span>Name</span><span>Desc(EN)</span><span>Desc(VI)</span><span>Desc(ZH)</span><span>Ratio</span><span>Qty</span><span>Unit</span><span />
                  </div>

                  {row.products.map(product => (
                    <div key={product.id} className="grid grid-cols-2 sm:grid-cols-[2fr_2fr_1fr_2fr_1fr_1fr_1fr_28px] gap-1 items-center bg-muted/20 rounded px-1 py-1">
                      <Input className={inputCls} value={product.product_code}
                        onChange={e => updateProduct(row.id, product.id, { product_code: e.target.value })} placeholder="Code" />
                      <Input className={inputCls} value={product.product_name}
                        onChange={e => updateProduct(row.id, product.id, { product_name: e.target.value })} placeholder="Name" />
                      <Input className={inputCls} value={product.product_description_en}
                        onChange={e => updateProduct(row.id, product.id, { product_description_en: e.target.value })} placeholder="Desc EN" />
                      <Input className={inputCls} value={product.product_description_vi}
                        onChange={e => updateProduct(row.id, product.id, { product_description_vi: e.target.value })} placeholder="Desc VI" />
                      <Input className={inputCls} value={product.product_description_zh_hant}
                        onChange={e => updateProduct(row.id, product.id, { product_description_zh_hant: e.target.value })} placeholder="Desc ZH" />
                      <Input className={inputCls} value={product.ratio ?? ''}
                        onChange={e => updateProduct(row.id, product.id, { ratio: e.target.value })} placeholder="Ratio" />
                      <Input className={`${inputCls} bg-muted cursor-not-allowed`} value={product.qty} readOnly placeholder="Auto" />
                      <Input className={inputCls} value={product.unit}
                        onChange={e => updateProduct(row.id, product.id, { unit: e.target.value })} placeholder="Unit" />
                      <Button variant="ghost" size="sm" className="h-6 w-7 p-0 text-destructive hover:text-destructive col-span-2 sm:col-span-1 justify-self-end"
                        onClick={() => removeProduct(row.id, product.id)} disabled={row.products.length <= 1}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      {/* ── Actions ── */}
      <div className="flex items-center gap-2 pt-1">
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addRow}>
          <Plus className="h-3 w-3 mr-1" />Add Step
        </Button>
        <Button size="sm" className="h-7 text-xs" onClick={handleSave} disabled={isSaving}>
          {isSaving ? t('common.processing') : (mode === 'create' ? t('common.create') : t('common.save'))}
        </Button>
      </div>
    </div>
  );
}