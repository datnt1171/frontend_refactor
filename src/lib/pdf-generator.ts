import { FinishingSheet } from '@/types';

export const generatePDF = (finishingSheet: FinishingSheet) => {
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page {
          size: A4 landscape;
          margin: 0mm;
        }
        
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        
        table {
          width: 100%;
          border-collapse: collapse
        }

        th, td {
          border: 1px solid #000;
          padding: 2px;
          text-align: left;
          vertical-align: top;
          word-wrap: break-word;
          overflow-wrap: break-word;
          font-size: 8px;
          break-inside: avoid;
          overflow: hidden; /* Prevent content from expanding cells */
        }
        
        th {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
        }
        
        /* Fixed column widths that add up to 100% */
        .col-step { width: 2.39%; min-width: 2.39%; max-width: 2.39%; }
        .col-stepname { width: 4.14%; min-width: 4.14%; max-width: 4.14%; }
        .col-viscosity { width: 7.37%; min-width: 7.37%; max-width: 7.37%; }
        .col-spec { width: 7.37%; min-width: 7.37%; max-width: 7.37%; }
        .col-hold { width: 3.02%; min-width: 3.02%; max-width: 3.02%; }
        .col-chemical { width: 5.61%; min-width: 5.61%; max-width: 5.61%; }
        .col-consumption { width: 5.61%; min-width: 5.61%; max-width: 5.61%; }
        .col-material-code { width: 6.74%; min-width: 6.74%; max-width: 6.74%; }
        .col-material-name { width: 7.51%; min-width: 7.51%; max-width: 7.51%; }
        .col-ratio { width: 3.51%; min-width: 3.51%; max-width: 3.51%; }
        .col-qty { width: 3.51%; min-width: 3.51%; max-width: 3.51%; }
        .col-unit { width: 3.51%; min-width: 3.51%; max-width: 3.51%; }
        .col-check { width: 8%; min-width: 8%; max-width: 8%; }
        .col-action { width: 8%; min-width: 8%; max-width: 8%; }
        .col-signature { width: 4.49%; min-width: 4.49%; max-width: 4.49%; }
        
        /* Ensure text wraps properly in fixed-width cells */
        .col-spec, .col-material-name, .col-check, .col-action {
          word-break: break-all;
          hyphens: auto;
        }

        .checkbox {
          display: inline-block;
          width: 10px;
          height: 10px;
          border: 1px solid #000;
          margin-right: 2px;
        }
      </style>
    </head>
    <body>
      <table>
        <tr>
        <!-- Header Row 1: Product Title -->
          <tr>
              <th colspan="18">
                  ${finishingSheet.finishing_code}
              <th/>
          </tr>
          
          <!-- Header Row 3: Content -->
          <tr>
              <td colspan="3">
                  <strong>Name:</strong> ${finishingSheet.name}<br>
                  <strong>Sheen:</strong> ${finishingSheet.sheen}<br>
                  <strong>DFT:</strong> ${finishingSheet.dft}<br>
                  <strong>Chemical:</strong> ${finishingSheet.type_of_paint}<br>
                  <strong>Substrate:</strong> ${finishingSheet.type_of_substrate}<br>
                  <strong>Grain Filling:</strong> ${finishingSheet.finishing_surface_grain}<br>
                  <strong>Developed/Duplicated by:</strong> ${finishingSheet.sampler}
              </td>
              <td colspan="1">
                  <strong>Chemical waste:</strong> ${finishingSheet.chemical_waste}<br>
                  <br>
                  <strong>Conveyor speed:</strong> ${finishingSheet.conveyor_speed}
              </td>
              <td colspan="3">
                  1. Wood substrate before finishing process should be below 10% MC<br>
                  2. Last sanding on white wood should be grit #240<br>
                  3. White wood surface must be free from grease, oil or other contamination. Please reject white wood with any defects.
              </td>
              <td colspan="2">
                <strong>With panel test:</strong>
                <span class="checkbox">${finishingSheet.with_panel_test ? "✔" : ""}</span><br />
                (Có mẫu test chuyền)<br />

                <strong>No panel test:</strong>
                <span class="checkbox">${!finishingSheet.with_panel_test ? "✔" : ""}</span><br />
                (Không có mẫu test chuyền)<br />

                <strong>Testing:</strong>
                <span class="checkbox">${finishingSheet.testing ? "✔" : ""}</span><br />

                <strong>Chemical Yellowing:</strong>
                <span class="checkbox">${finishingSheet.chemical_yellowing ? "✔" : ""}</span>
              </td>
              <td colspan="5">
                  4. Always ask TE-1 for advice in case of changing process mixing ratio, application amount, drying time, application method, must get approval form... If there is any changing.<br>
                  5. Strictly follow the process, always refer to the PCP<br>
                  6. Viscosity reading using NK2 cup standard.
              </td>
              <td colspan="4" style="text-align: center; vertical-align: middle;">
                  <strong>DAILY CHECK LIST</strong><br>
                  (Kiểm tra hằng ngày)<br>
                  Date: _______________
              </td>
          </tr>
          <tr style="font-weight: bold;">
            <td class="col-step">Step</td>
            <td class="col-stepname">Step Name</td>
            <td class="col-viscosity">Viscosity & Wet Mill Thickness (EN)</td>
            <td class="col-viscosity">Viscosity & Wet Mill Thickness (VN)</td>
            <td class="col-spec">SPEC EN</td>
            <td class="col-spec">SPEC VN</td>
            <td class="col-hold">Hold Time (min)</td>
            <td class="col-chemical">Chemical Mixing Code</td>
            <td class="col-consumption">Consumption (per m2)</td>
            <td class="col-material-code">Material Code</td>
            <td class="col-material-name">Material Name</td>
            <td class="col-ratio">Ratio</td>
            <td class="col-qty">Qty (per m2)</td>
            <td class="col-unit">Unit</td>
            <td class="col-check">Check Result</td>
            <td class="col-action">Correct Action</td>
            <td class="col-signature">TE-1's Name & Signature</td>
            <td class="col-signature">Customer Signature</td>
          </tr>
        </tr>
        <tbody>
  `;

  finishingSheet.rows.forEach((stepData, stepIndex) => {
    const materials = stepData.products;
    const materialCount = materials.length;
    
    materials.forEach((material, materialIndex) => {
      const isFirstMaterial = materialIndex === 0;
      
      htmlContent += `
        <tr>
          ${isFirstMaterial ? `
            <td class="merged-cell col-step" rowspan="${materialCount}">Step ${stepIndex + 1} Booth ${stepData.spot}</td>
            <td class="merged-cell col-stepname" rowspan="${materialCount}">${stepData.stepname_en || ''}</td>
            <td class="merged-cell col-viscosity" rowspan="${materialCount}">${stepData.viscosity_en || ''}</td>
            <td class="merged-cell col-viscosity" rowspan="${materialCount}">${stepData.viscosity_vi || ''}</td>
            <td class="merged-cell col-spec" rowspan="${materialCount}">${stepData.spec_en || ''}</td>
            <td class="merged-cell col-spec" rowspan="${materialCount}">${stepData.spec_vi || ''}</td>
            <td class="merged-cell col-hold" rowspan="${materialCount}">${stepData.hold_time || ''}</td>
            <td class="merged-cell col-chemical" rowspan="${materialCount}">${stepData.chemical_code || ''}</td>
            <td class="merged-cell col-consumption" rowspan="${materialCount}">${stepData.consumption || ''}</td>
          ` : ''}
          <td class="col-material-code">${material.product_code || ''}</td>
          <td class="col-material-name">${material.product_name || ''}</td>
          <td class="col-ratio">${material.ratio || ''}</td>
          <td class="col-qty">${material.qty || ''}</td>
          <td class="col-unit">${material.unit || ''}</td>
          <td class="col-check">${material.check_result || ''}</td>
          <td class="col-action">${material.correct_action || ''}</td>
          <td class="col-signature">${material.te1_signature || ''}</td>
          <td class="col-signature">${material.customer_signature || ''}</td>
        </tr>
      `;
    });
  });

  htmlContent += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Create a blob with the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
        URL.revokeObjectURL(url); // Clean up the blob URL
      }, 100);
    };
  } else {
    // Clean up if window couldn't be opened
    URL.revokeObjectURL(url);
    console.error('Failed to open print window');
  }
};