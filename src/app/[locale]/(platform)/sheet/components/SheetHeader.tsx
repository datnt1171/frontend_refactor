import React from 'react';

export const SheetHeader: React.FC = () => (
  <thead className="bg-gray-100">
    {/* Product Title Row */}
    <tr>
      <td colSpan={18} className="border border-gray-300 px-2 py-2 text-center font-bold text-lg">
        RH-OAK-51-1 ( BARON )
      </td>
    </tr>
    
    {/* Product Details Row */}
    <tr className="text-left text-xs">
      <td colSpan={3} className="border border-gray-300 px-1 py-1">
        <div>
          <strong>Name:</strong> RH-BARON BROWN FINISHED ON EU OAK 0.6mm<br/>
          <strong>Sheen:</strong> 0+5-0<br/>
          <strong>DFT:</strong><br/>
          <strong>Chemical:</strong> PU/NC<br/>
          <strong>Substrate:</strong> OAK VENEER , OAK WOOD<br/>
          <strong>Grain Filling:</strong> OPEN GRAIN<br/>
          <strong>Developed/Duplicated by:</strong> MR LƯU
        </div>
      </td>
      <td colSpan={1} className="border border-gray-300 px-1 py-1">
        <strong>Chemical waste:</strong> 0%<br/>
        <br/>
        <strong>Conveyor speed:</strong> 1.5 METER PER 1 MINUTE
      </td>
      <td colSpan={3} className="border border-gray-300 px-1 py-1">
        1. Wood substrate before finishing process should be below 10% MC<br/>
        2. Last sanding on white wood should be grit #240<br/>
        3. White wood surface must be free from grease, oil or other contamination. Please reject white wood with any defects.
      </td>
      <td colSpan={2} className="border border-gray-300 px-1 py-1">
        <strong>With panel test:</strong> <span className="inline-block w-4 h-4 border border-gray-400 mr-1"></span><br/>
        (Có mẫu test chuyền)<br/>
        <strong>No panel test:</strong> <span className="inline-block w-4 h-4 border border-gray-400 mr-1"></span><br/>
        (Không có mẫu test chuyền)<br/>
        <strong>Testing:</strong> <span className="inline-block w-4 h-4 border border-gray-400 mr-1"></span><br/>
        <strong>Chemical Yellowing:</strong> <span className="inline-block w-4 h-4 border border-gray-400 mr-1"></span>
      </td>
      <td colSpan={5} className="border border-gray-300 px-1 py-1">
        4. Always ask TE-1 for advice in case of changing process mixing ratio, application amount, drying time, application method, must get approval form... If there is any changing.<br/>
        5. Strictly follow the process, always refer to the PCP<br/>
        6. Viscosity reading using NK2 cup standard.
      </td>
      <td colSpan={4} className="border border-gray-300 px-1 py-1 text-center">
        <div className="font-bold">DAILY CHECK LIST</div>
        <div>(Kiểm tra hằng ngày)</div>
        <div>Date: _______________</div>
      </td>
    </tr>

    {/* Column Headers Row */}
    <tr className="font-bold text-xs">
      <td className="border border-gray-300 px-1 py-1" style={{ width: '2.39%' }}>Step</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '4.14%' }}>Step Name</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '7.37%' }}>Viscosity & Wet Mill Thickness (EN)</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '7.37%' }}>Viscosity & Wet Mill Thickness (VN)</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '7.37%' }}>SPEC EN</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '7.37%' }}>SPEC VN</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '3.02%' }}>Hold Time (min)</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '5.61%' }}>Chemical Mixing Code</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '5.61%' }}>Consumption (per m2)</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '6.74%' }}>Material Code</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '7.51%' }}>Material Name</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '3.51%' }}>Ratio</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '3.51%' }}>Qty (per m2)</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '3.51%' }}>Unit</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '8%' }}>Check Result</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '8%' }}>Correct Action</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '4.49%' }}>TE-1's Name & Signature</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '4.49%' }}>Customer Signature</td>
      <td className="border border-gray-300 px-1 py-1" style={{ width: '2%' }}>Actions</td>
    </tr>
  </thead>
);