import { FinishingSheet, TaskDataDetail } from '@/types';

const getBase64 = async (url: string): Promise<string> => {
  const res = await fetch(url)
  const blob = await res.blob()
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

export interface PDFConfig {
  languages: { en: boolean; vi: boolean; zh_hant: boolean }
  pageSize?: 'A4' | 'A5'
  orientation?: 'portrait' | 'landscape'
}

// Shared only: print logic + multiLang helper
const printHTML = (htmlContent: string) => {
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const printWindow = window.open(url, '_blank')
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      setTimeout(() => { printWindow.close(); URL.revokeObjectURL(url) }, 100)
    }
  } else {
    URL.revokeObjectURL(url)
  }
}

const multiLang = (
  en: string, vi: string, zh: string,
  flags: PDFConfig['languages']
): string => [
  flags.en && en, flags.vi && vi, flags.zh_hant && zh
].filter(Boolean).join('<br>')


// ── Format 1: Simple Form ──────────────────────────────────────────────────

export const generateSimpleFormPDF = (
  sheet: FinishingSheet,
  detail: TaskDataDetail,
  config: PDFConfig
) => {
  const rows = sheet.rows.map((row, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${row.products.map(p => p.product_name).join('<br>')}</td>
      <td>${multiLang(
        `${row.viscosity_en}, ${row.spec_en}`,
        `${row.viscosity_vi}, ${row.spec_vi}`,
        `${row.viscosity_zh_hant}, ${row.spec_zh_hant}`,
        config.languages
      )}</td>
      <td>${multiLang(
        row.hold_time ? `${row.hold_time} minute${row.sanding_en ? ', ' + row.sanding_en : ''}` : '',
        row.hold_time ? `${row.hold_time} phút${row.sanding_vi ? ', ' + row.sanding_vi : ''}` : '',
        row.hold_time ? `${row.hold_time} 分鐘${row.sanding_zh_hant ? ', ' + row.sanding_zh_hant : ''}` : '',
        config.languages
      )}</td>
    </tr>
  `).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: ${config.pageSize ?? 'A5'} ${config.orientation ?? 'portrait'}; margin: 5mm; }
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; font-size: 11px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
    th, td { border: 1px solid #000; padding: 4px; vertical-align: top; word-wrap: break-word; }
    th { background-color: #fff; font-weight: bold; text-align: center; }
    .label { font-weight: bold; width: 50%; }
    @media print { body { print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div style="text-align:center">
    <div>CÔNG TY TNHH HÓA PHẨM VIỆT LIÊN</div>
    <div>越聯化工責任有限公司</div>
    <div>Tel:0274.368.6910（11-12） fax:0274.368.6907</div>
    <div>Production Process ${sheet.finishing_code}</div>
  </div>

  <table>
    <tr>
      <td class="label"><b>Ngày làm:</b> ${new Date(sheet.created_at).toLocaleDateString()}</td>
      <td class="label"><b>Hệ sơn:</b> ${sheet.type_of_paint}</td>
    </tr>
    <tr>
      <td class="label"><b>Tên Công Ty:</b> ${detail.factory_name}</td>
      <td class="label"><b>Loại gỗ:</b> ${sheet.type_of_substrate}</td>
    </tr>
    <tr>
      <td class="label"><b>Mã số bản mẫu:</b> ${sheet.finishing_code}</td>
      <td class="label"><b>Người làm:</b> ${sheet.sampler}</td>
    </tr>
    <tr>
      <td class="label"><b>Độ bóng:</b> ${sheet.sheen_level}</td>
      <td class="label"><b>Xử lý phá hoại:</b> Distressing</td>
    </tr>
  </table>

  <table>
    <thead>
      <tr>
        <th style="width:8%">No.</th>
        <th style="width:35%">Process</th>
        <th style="width:32%">Remark</th>
        <th style="width:25%">Drying time</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:50px;text-align:center;margin-top:20px">
    <div style="border-bottom:1px solid #000">Customer confirm</div>
    <div style="border-bottom:1px solid #000">Manager confirm</div>
  </div>
</body>
</html>`

  printHTML(html)
}


// ── Format 2: Detailed Sheet ───────────────────────────────────────────────

export const generateVFRFormPDF = (
  sheet: FinishingSheet,
  detail: TaskDataDetail,
  config: PDFConfig
) => {
  const rows = sheet.rows.map((row) => {
    const count = row.products.length
    return row.products.map((material, i) => `
      <tr>
        ${i === 0 ? `
          <td class="col-step" rowspan="${count}">Step ${row.order}<br>Booth ${row.spot ?? ''}</td>
          <td class="col-stepname" rowspan="${count}">${row.name_en ?? ''}</td>
          <td class="col-viscosity" rowspan="${count}">${row.viscosity_en ?? ''}</td>
          <td class="col-viscosity" rowspan="${count}">${row.viscosity_vi ?? ''}</td>
          <td class="col-spec" rowspan="${count}">${row.spec_en ?? ''}</td>
          <td class="col-spec" rowspan="${count}">${row.spec_vi ?? ''}</td>
          <td class="col-hold" rowspan="${count}">${row.hold_time ?? ''}</td>
          <td class="col-chemical" rowspan="${count}">${row.chemical_code ?? ''}</td>
          <td class="col-consumption" rowspan="${count}">${row.consumption ?? ''}</td>
        ` : ''}
        <td class="col-material-code">${material.product_code ?? ''}</td>
        <td class="col-material-name">${material.product_name ?? ''}</td>
        <td class="col-ratio">${material.ratio ?? ''}</td>
        <td class="col-qty">${material.qty ?? ''}</td>
        <td class="col-unit">${material.unit ?? ''}</td>
      </tr>
    `).join('')
  }).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: ${config.pageSize ?? 'A4'} ${config.orientation ?? 'landscape'}; margin: 0mm; }
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; font-size: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #000; padding: 2px; vertical-align: top; word-wrap: break-word; overflow-wrap: break-word; font-size: 8px; }
    th { font-size: 18px; font-weight: bold; text-align: center; }
    .checkbox { display: inline-block; width: 10px; height: 10px; border: 1px solid #000; margin-right: 2px; }
    .col-step      { width: 2.39%; }
    .col-stepname  { width: 4.14%; }
    .col-viscosity { width: 7.37%; }
    .col-spec      { width: 7.37%; }
    .col-hold      { width: 3.02%; }
    .col-chemical  { width: 5.61%; }
    .col-consumption { width: 5.61%; }
    .col-material-code { width: 6.74%; }
    .col-material-name { width: 7.51%; }
    .col-ratio { width: 3.51%; }
    .col-qty   { width: 3.51%; }
    .col-unit  { width: 3.51%; }
    @media print { body { print-color-adjust: exact; } }
  </style>
</head>
<body>
  <table>
    <tr><th colspan="14">${sheet.finishing_code}</th></tr>
    <tr>
      <td colspan="3">
        <strong>Sheen:</strong> ${sheet.sheen_level}<br>
        <strong>DFT:</strong> ${sheet.dft}<br>
        <strong>Chemical:</strong> ${sheet.type_of_paint}<br>
        <strong>Substrate:</strong> ${sheet.type_of_substrate}<br>
        <strong>Grain Filling:</strong> ${sheet.finishing_surface_grain}<br>
        <strong>Developed by:</strong> ${sheet.sampler}
      </td>
      <td colspan="1">
        <strong>Chemical waste:</strong> ${sheet.chemical_waste}<br><br>
        <strong>Conveyor speed:</strong> ${sheet.conveyor_speed}
      </td>
      <td colspan="3">
        1. Wood substrate before finishing process should be below 10% MC<br>
        2. Last sanding on white wood should be grit #240<br>
        3. White wood surface must be free from grease, oil or other contamination.
      </td>
      <td colspan="2">
        <strong>With panel test:</strong> <span class="checkbox">${sheet.with_panel_test ? '✔' : ''}</span><br>
        <strong>No panel test:</strong> <span class="checkbox">${!sheet.with_panel_test ? '✔' : ''}</span><br>
        <strong>Testing:</strong> <span class="checkbox">${sheet.testing ? '✔' : ''}</span><br>
        <strong>Chemical Yellowing:</strong> <span class="checkbox">${sheet.chemical_yellowing ? '✔' : ''}</span>
      </td>
      <td colspan="5">
        4. Always ask TE-1 for advice in case of changing process.<br>
        5. Strictly follow the process, always refer to the PCP.<br>
        6. Viscosity reading using NK2 cup standard.
      </td>
    </tr>
    <tr style="font-weight:bold">
      <td class="col-step">Step</td>
      <td class="col-stepname">Step Name</td>
      <td class="col-viscosity">Viscosity & WMT (EN)</td>
      <td class="col-viscosity">Viscosity & WMT (VN)</td>
      <td class="col-spec">SPEC EN</td>
      <td class="col-spec">SPEC VN</td>
      <td class="col-hold">Hold Time</td>
      <td class="col-chemical">Chemical Code</td>
      <td class="col-consumption">Consumption</td>
      <td class="col-material-code">Material Code</td>
      <td class="col-material-name">Material Name</td>
      <td class="col-ratio">Ratio</td>
      <td class="col-qty">Qty</td>
      <td class="col-unit">Unit</td>
    </tr>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`

  printHTML(html)
}


export const generateKaiserPDF = async (
  sheet: FinishingSheet,
  detail: TaskDataDetail,
  config: PDFConfig
) => {
  const logoBase64 = await getBase64('/logo_vietlien.png')
  const sampleImage = sheet.images?.[0]?.image ?? null
  const sampleImageBase64 = sampleImage ? await getBase64(sampleImage) : null

  const rows = sheet.rows.map((row) => {
    const count = row.products.length
    return row.products.map((material, i) => `
      <tr>
        ${i === 0 ? `
          <td class="col-no" rowspan="${count}">${row.order}</td>
          <td class="col-step" rowspan="${count}">
            <strong>${row.name_short_en ?? ''}</strong><br>
            <span class="vi">${row.name_short_vi ?? ''}</span>
          </td>
        ` : ''}
        <td class="col-code">${material.product_code ?? ''}</td>
        <td class="col-desc">
          ${material.product_description_en ?? ''}<br>
          <span class="vi">${material.product_description_vi ?? ''}</span>
        </td>
        <td class="col-gram">${material.qty ?? ''}</td>
        <td class="col-ratio">${material.ratio ?? ''}%</td>
        ${i === 0 ? `
          <td class="col-viscosity" rowspan="${count}">${row.viscosity_en ?? ''}</td>
          <td class="col-application" rowspan="${count}">
            ${row.spec_en ?? ''}<br>
            <span class="vi">${row.spec_vi ?? ''}</span>
          </td>
        ` : ''}
      </tr>
    `).join('')
  }).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: ${config.pageSize ?? 'A4'} ${config.orientation ?? 'portrait'}; margin: 8mm; }
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; font-size: 8px; }

    /* Header */
    .title-block { text-align: center; margin-bottom: 6px; }
    .title-block h1 { font-size: 16px; font-weight: bold; margin: 0 0 4px; letter-spacing: 1px; }
    .logo { font-size: 10px; font-weight: bold; color: #c00; }

    /* Meta table */
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
    .meta-table td { border: 1px solid #000; padding: 3px 5px; font-size: 8px; vertical-align: middle; }
    .meta-table .meta-label { font-weight: bold; width: 80px; background: #f5f5f5; }
    .meta-table .meta-value { width: 200px; }
    .meta-table .img-cell { width: 90px; text-align: center; vertical-align: middle; border-left: 1px solid #000; }

    /* Sanding note */
    .sanding-note { text-align: center; font-weight: bold; font-size: 9px; margin: 4px 0; border: 1px solid #000; padding: 2px; }

    /* Main table */
    table.main { width: 100%; border-collapse: collapse; }
    table.main th, table.main td {
      border: 1px solid #000;
      padding: 2px 3px;
      vertical-align: top;
      word-wrap: break-word;
      font-size: 7.5px;
    }
    table.main th { background: #fff; font-weight: bold; text-align: center; font-size: 8px; }

    .col-no          { width: 3%; text-align: center; }
    .col-step        { width: 10%; font-weight: bold; }
    .col-code        { width: 12%; }
    .col-desc        { width: 22%; }
    .col-gram        { width: 6%; text-align: center; }
    .col-ratio       { width: 8%; text-align: center; }
    .col-viscosity   { width: 8%; text-align: center; }
    .col-application { width: 31%; }

    .vi { color: #444; }

    /* Signatures */
    .sig-row { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 12px; text-align: center; }
    .sig-box { border-top: 1px solid #000; padding-top: 2px; font-size: 8px; }

    /* Note */
    .note { font-size: 7px; margin-top: 6px; }

    @media print { body { print-color-adjust: exact; } }
  </style>
</head>
<body>

  <!-- Title -->
  <div class="title-block">
    <img src="${logoBase64}" style="height: 40px; width: auto;" />
    <h1>FINISHING SCHEDULE</h1>
  </div>

  <!-- Meta info -->
  <table class="meta-table">
    <tr>
      <td class="meta-label">CUSTOMER:</td>
      <td class="meta-value">${detail.factory_name ?? ''}</td>
      <td class="meta-label">CODE:</td>
      <td class="meta-value">${sheet.finishing_code ?? ''}</td>
      <td class="img-cell" rowspan="4">
        <img src="${sampleImageBase64 ?? ''}" style="height: 80px; width: 80px; object-fit: contain;" />
      </td>
    </tr>
    <tr>
      <td class="meta-label">FACTORY:</td>
      <td class="meta-value">${sheet.factory_code ?? ''}</td>
      <td class="meta-label">COLOR NAME:</td>
      <td class="meta-value">${sheet.customer_color_name ?? ''}</td>
    </tr>
    <tr>
      <td class="meta-label">SALE MANAGER:</td>
      <td class="meta-value">${sheet.sampler ?? ''}</td>
      <td class="meta-label">SUBSTRATE:</td>
      <td class="meta-value">${sheet.type_of_substrate ?? ''}</td>
    </tr>
    <tr>
      <td class="meta-label">DATE:</td>
      <td class="meta-value">${new Date(sheet.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
      <td class="meta-label">FINISH BY:</td>
      <td class="meta-value">${sheet.finishing_surface_grain ?? ''}</td>
    </tr>
  </table>

  <!-- Sanding note -->
  <div class="sanding-note">SANDING #240/#320</div>

  <!-- Main process table -->
  <table class="main">
    <thead>
      <tr>
        <th class="col-no">No.</th>
        <th class="col-step">Step</th>
        <th class="col-code">Material code</th>
        <th class="col-desc">Description</th>
        <th class="col-gram">Gram</th>
        <th class="col-ratio">Mixing ratio</th>
        <th class="col-viscosity">Viscosity<br>(NK2 cup)</th>
        <th class="col-application">Application details</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <!-- Note -->
  <div class="note">
    *note 1. The paint ratio is only used as a reference for color matching. The actual operation refers to the color panel.<br>
    2. Special process will be provided.
  </div>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-box">Customer Confirm</div>
    <div class="sig-box">Technical Director Confirm</div>
  </div>

</body>
</html>`

  printHTML(html)
}

export const generateKhangshenPDF = async (
  sheet: FinishingSheet,
  detail: TaskDataDetail,
  config: PDFConfig
) => {
  const rows = sheet.rows.map((row) => {
    const count = row.products.length
    return row.products.map((material, i) => `
      <tr>
        ${i === 0 ? `
          <td class="col-booth" rowspan="${count}">${row.spot ?? ''}</td>
          <td class="col-step" rowspan="${count}">
            <strong>${row.name_short_zh_hant ?? ''}</strong><br>
            <span class="vi">${row.name_short_vi ?? ''}</span>
          </td>
        ` : ''}
        <td class="col-paintname">
          ${material.product_description_zh_hant ?? ''}<br>
          <span class="vi">${material.product_description_vi ?? ''}</span>
        </td>
        <td class="col-paintcode">${material.product_code ?? ''}</td>
        ${i === 0 ? `
          <td class="col-viscosity" rowspan="${count}">${row.viscosity_zh_hant ?? ''}</td>
        ` : ''}
        <td class="col-ratio">${material.ratio ?? ''}${material.ratio ? '%' : ''}</td>
        ${i === 0 ? `
          <td class="col-method" rowspan="${count}">
            ${row.spec_zh_hant ?? ''}<br>
            <span class="vi">${row.spec_vi ?? ''}</span>
          </td>
          <td class="col-drytime" rowspan="${count}">
            ${row.hold_time ? `${row.hold_time}` : ''}
          </td>
          <td class="col-sanding" rowspan="${count}">
            ${row.sanding_zh_hant ?? ''}
          </td>
        ` : ''}
      </tr>
    `).join('')
  }).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: ${config.pageSize ?? 'A4'} ${config.orientation ?? 'portrait'}; margin: 8mm; }
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; font-size: 8px; }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .header-center { text-align: center; flex: 1; }
    .header-center .title-main { font-size: 13px; font-weight: bold; }
    .header-center .title-sub { font-size: 9px; }
    .header-side { font-size: 8px; font-weight: bold; text-align: center; min-width: 120px; }

    /* Meta table */
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
    .meta-table td { border: 1px solid #000; padding: 2px 4px; font-size: 8px; vertical-align: middle; }
    .meta-label { font-weight: bold; background: #f5f5f5; width: 70px; }
    .meta-value { min-width: 100px; }

    /* Main table */
    table.main { width: 100%; border-collapse: collapse; }
    table.main th, table.main td {
      border: 1px solid #000;
      padding: 2px 3px;
      vertical-align: middle;
      word-wrap: break-word;
      font-size: 7.5px;
    }
    table.main th {
      background: #fff;
      font-weight: bold;
      text-align: center;
      font-size: 8px;
    }

    .col-booth      { width: 5%;  text-align: center; }
    .col-step       { width: 9%; font-weight: bold; }
    .col-paintname  { width: 26%; }
    .col-paintcode  { width: 12%; text-align: center; }
    .col-viscosity  { width: 6%;  text-align: center; }
    .col-ratio      { width: 7%;  text-align: center; }
    .col-method     { width: 18%; }
    .col-drytime    { width: 10%; text-align: center; }
    .col-sanding    { width: 7%;  text-align: center; }

    .vi { color: #444; }

    /* Signatures */
    .sig-row { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-top: 14px; text-align: center; }
    .sig-box { font-size: 8px; }
    .sig-box .sig-label { font-weight: bold; margin-bottom: 18px; }
    .sig-box .sig-line { border-top: 1px solid #000; padding-top: 2px; }

    @media print { body { print-color-adjust: exact; } }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="header-side">
      ${detail.factory_name ?? ''}<br>
      <span style="font-weight:normal;font-size:7px">${sheet.factory_code ?? ''}</span>
    </div>
    <div class="header-center">
      <div class="title-main">康德盛大货涂装流程表</div>
      <div class="title-sub">Biểu quy trình sơn sản xuất Khang Đức Thịnh</div>
    </div>
    <div class="header-side">
      越聯化工責任有限公司<br>
      <span style="font-weight:normal;font-size:7px">CTY TNHH HÓA PHẨM VIỆT LIÊN</span>
    </div>
  </div>

  <!-- Meta info -->
  <table class="meta-table">
    <tr>
      <td class="meta-label">色板编号<br><span class="vi">Mã số bảng màu</span></td>
      <td class="meta-value">${sheet.finishing_code ?? ''}</td>
      <td class="meta-label">亮度<br><span class="vi">Độ bóng</span></td>
      <td class="meta-value">${sheet.sheen_level ?? ''}</td>
      <td class="meta-label">材质<br><span class="vi">Gỗ</span></td>
      <td class="meta-value">${sheet.type_of_substrate ?? ''}</td>
    </tr>
    <tr>
      <td class="meta-label">破坏处理<br><span class="vi">Xử lý giả cổ</span></td>
      <td class="meta-value">${sheet.substrate_surface_treatment ?? ''}</td>
      <td class="meta-label">制作日期<br><span class="vi">Ngày tháng làm</span></td>
      <td class="meta-value">${new Date(sheet.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
      <td class="meta-label">制作人<br><span class="vi">Người thao tác</span></td>
      <td class="meta-value">${sheet.sampler ?? ''}</td>
    </tr>
  </table>

  <!-- Main table -->
  <table class="main">
    <thead>
      <tr>
        <th class="col-booth">喷台<br><span style="font-weight:normal">bồn phun</span></th>
        <th class="col-step">操作步骤<br><span style="font-weight:normal">Bước thao tác</span></th>
        <th class="col-paintname">油漆名称<br><span style="font-weight:normal">tên sơn</span></th>
        <th class="col-paintcode">油漆编号<br><span style="font-weight:normal">mã số sơn</span></th>
        <th class="col-viscosity">秒数<br><span style="font-weight:normal">số giây</span></th>
        <th class="col-ratio">比列<br><span style="font-weight:normal">tỉ lệ</span></th>
        <th class="col-method">操作方法<br><span style="font-weight:normal">phương pháp thao tác</span></th>
        <th class="col-drytime">待干时间<br><span style="font-weight:normal">thời gian chờ khô</span></th>
        <th class="col-sanding">砂紙<br><span style="font-weight:normal">Nhám</span></th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <!-- Signatures -->
  <div class="sig-row">
    <div class="sig-box">
      <div class="sig-label">客户確認<br><span style="font-weight:normal">khách hàng xác nhận</span></div>
      <div class="sig-line"></div>
    </div>
    <div class="sig-box">
      <div class="sig-label">化工厂確認<br><span style="font-weight:normal">cty sơn hóa chất xác nhận</span></div>
      <div class="sig-line"></div>
    </div>
  </div>

</body>
</html>`

  printHTML(html)
}

export const generateReturnGoldPDF = async (
  sheet: FinishingSheet,
  detail: TaskDataDetail,
  config: PDFConfig
) => {
  const logoBase64 = await getBase64('/logo_vietlien.png')

  // Calculate subtotal g/m2 per row and grand total
  const grandTotal = sheet.rows.reduce((sum, row) => {
    return sum + row.products.reduce((s, p) => s + parseFloat(p.qty ?? '0'), 0)
  }, 0)

  const rows = sheet.rows.map((row) => {
    const count = row.products.length
    const subtotal = row.products.reduce((s, p) => s + parseFloat(p.qty ?? '0'), 0)

    const productRows = row.products.map((material, i) => `
      <tr>
        ${i === 0 ? `
          <td class="col-no" rowspan="${count + 1}">${row.order}</td>
          <td class="col-step" rowspan="${count + 1}">
            <strong>${row.name_short_zh_hant ?? ''}</strong><br>
            <span class="vi">${row.name_short_vi ?? ''}</span>
            ${row.viscosity_zh_hant ? `<br><span class="subtext">(${row.viscosity_zh_hant})</span>` : ''}
          </td>
          <td class="col-application" rowspan="${count + 1}">
            ${row.spec_zh_hant ?? ''}<br>
            <span class="vi">${row.spec_vi ?? ''}</span>
          </td>
        ` : ''}
        <td class="col-code">${material.product_code ?? ''}</td>
        <td class="col-desc">
          ${material.product_description_zh_hant ?? ''}<br>
          <span class="vi">${material.product_description_vi ?? ''}</span>
        </td>
        <td class="col-gm2">${material.qty ?? ''}</td>
        <td class="col-ratio">${material.ratio ?? ''}${material.ratio ? '%' : ''}</td>
      </tr>
    `).join('')

    const subtotalRow = `
      <tr class="subtotal-row">
        <td colspan="2" class="subtotal-label">小计</td>
        <td class="col-gm2">${subtotal > 0 ? subtotal.toFixed(1) : ''}</td>
        <td class="col-ratio">100%</td>
      </tr>
    `

    return productRows + subtotalRow
  }).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: ${config.pageSize ?? 'A4'} ${config.orientation ?? 'portrait'}; margin: 10mm 8mm; }
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; font-size: 8px; }

    /* Header */
    .header { display: flex; align-items: flex-start; margin-bottom: 6px; }
    .header-logo { width: 60px; margin-right: 10px; }
    .header-logo img { width: 50px; height: auto; }
    .header-title { flex: 1; text-align: center; }
    .header-title .zh { font-size: 16px; font-weight: bold; letter-spacing: 2px; }
    .header-title .en { font-size: 13px; font-weight: bold; }

    /* Meta */
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 16px; margin-bottom: 6px; font-size: 8.5px; }
    .meta-item { display: flex; gap: 4px; }
    .meta-key { font-weight: bold; white-space: nowrap; }
    .meta-highlight { background: #ffe066; padding: 0 3px; font-weight: bold; }

    /* Distressing bar */
    .distressing { border: 1px solid #000; background: #f9f9f9; padding: 3px 6px; font-size: 8px; margin-bottom: 0; font-weight: bold; text-align: center; }

    /* Main table */
    table.main { width: 100%; border-collapse: collapse; }
    table.main th, table.main td {
      border: 1px solid #000;
      padding: 2px 4px;
      vertical-align: middle;
      word-wrap: break-word;
      font-size: 7.5px;
    }
    table.main th {
      background: #fff;
      font-weight: bold;
      text-align: center;
      font-size: 8px;
    }
    .col-no          { width: 4%;  text-align: center; }
    .col-step        { width: 11%; font-weight: bold; text-align: center; }
    .col-code        { width: 14%; }
    .col-desc        { width: 22%; }
    .col-application { width: 28%; }
    .col-gm2         { width: 9%;  text-align: right; padding-right: 5px; }
    .col-ratio       { width: 8%;  text-align: right; padding-right: 5px; }

    .vi      { color: #444; }
    .subtext { font-weight: normal; font-size: 7px; }

    /* Subtotal row */
    .subtotal-row td {
      text-align: right;
      font-weight: bold;
      background: #f5f5f5;
      font-size: 7.5px;
      padding-right: 5px;
    }
    .subtotal-label { text-align: right !important; font-weight: bold; }

    /* Total row */
    .total-row td {
      font-weight: bold;
      background: #eee;
      text-align: right;
      padding-right: 5px;
      font-size: 8px;
    }

    /* Ratio header split */
    .ratio-header { text-align: center; }

    /* Notes */
    .notes-table { width: 100%; border-collapse: collapse; margin-top: 0; }
    .notes-table td { border: 1px solid #000; padding: 4px 6px; font-size: 7.5px; vertical-align: top; }
    .notes-label { font-weight: bold; width: 60px; }
    .notes-content { font-style: italic; line-height: 1.6; }

    /* Footer */
    .footer { text-align: center; margin-top: 10px; font-weight: bold; font-size: 8.5px; border-top: 1px solid #000; padding-top: 4px; }

    @media print { body { print-color-adjust: exact; } }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="header-logo">
      <img src="${logoBase64}" style="height: 40px; width: auto;" />
    </div>
    <div class="header-title">
      <div class="zh">塗裝流程表</div>
      <div class="en">FINISHING SCHEDULE</div>
    </div>
  </div>

  <!-- Meta info -->
  <div class="meta">
    <div class="meta-item">
      <span class="meta-key">Customer 客戶名稱 Khách hàng</span>
      <span>${detail.factory_name ?? ''}</span>
    </div>
    <div class="meta-item">
      <span class="meta-key">Substrate 材質 Loại gỗ</span>
      <span>${sheet.type_of_substrate ?? ''}</span>
    </div>
    <div class="meta-item">
      <span class="meta-key">Factory 工廠 Nhà máy</span>
      <span>${sheet.factory_code ?? ''}</span>
    </div>
    <div class="meta-item">
      <span class="meta-key">System 系列 Hệ sơn</span>
      <span>${sheet.type_of_paint ?? ''}</span>
    </div>
    <div class="meta-item">
      <span class="meta-key">Color name 色板編號 Mã màu</span>
      <span class="meta-highlight">${sheet.finishing_code ?? ''} ${sheet.customer_color_name ?? ''}</span>
    </div>
    <div class="meta-item">
      <span class="meta-key">Date 日期</span>
      <span>${new Date(sheet.created_at).toLocaleDateString('zh-TW', { year: 'numeric', month: 'numeric', day: 'numeric' })}</span>
    </div>
    <div class="meta-item"></div>
    <div class="meta-item">
      <span class="meta-key">Sheen 亮度 Độ bóng</span>
      <span>${sheet.sheen_level ?? ''}</span>
    </div>
  </div>

  <!-- Distressing bar -->
  <div class="distressing">
    Distressing/ Đục giả cổ/ 破坏处理: ${sheet.substrate_surface_treatment ?? ''}
  </div>

  <!-- Main table -->
  <table class="main">
    <thead>
      <tr>
        <th class="col-no" rowspan="2">No</th>
        <th class="col-step" rowspan="2">Step 流程<br><span style="font-weight:normal">Lưu Trình</span></th>
        <th class="col-code" rowspan="2">Material code 油漆<br><span style="font-weight:normal">Mã số sơn</span></th>
        <th class="col-desc" rowspan="2">Description 明細<br><span style="font-weight:normal">Chi tiết</span></th>
        <th class="col-application" rowspan="2">Application details 操作說明<br><span style="font-weight:normal">Thuyết Minh Về Sơn</span></th>
        <th colspan="2" class="ratio-header">Ratio</th>
      </tr>
      <tr>
        <th class="col-gm2">G/M2</th>
        <th class="col-ratio">%</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr class="total-row">
        <td colspan="5" style="text-align:right; padding-right:6px;">TOTAL 总计</td>
        <td class="col-gm2">${grandTotal > 0 ? grandTotal.toFixed(1) : ''}</td>
        <td class="col-ratio">Gr</td>
      </tr>
    </tbody>
  </table>

  <!-- Notes -->
  <table class="notes-table">
    <tr>
      <td class="notes-label">*Note</td>
      <td class="notes-content">
        Cons (g/m2) tính trên bề mặt phẳng/ Cons (g/m2) calculated on flat surface<br>
        Lượng sơn tiêu thụ thực tế phải được tính lại trong quá trình sản xuất / Paint consumption must be re-calculated in production<br>
        Tất cả sản phẩm phải được khuấy đều trước khi sử dụng/ All materials must be agitated well before using
      </td>
    </tr>
  </table>

  <!-- Footer -->
  <div class="footer">Reviewed by CTS Manager</div>

</body>
</html>`

  printHTML(html)
}