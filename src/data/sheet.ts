import { StepTemplate, ChemicalTemplate } from '@/types';

export const stepTemplates: StepTemplate[] = [
  { 
    id: 'step1', 
    stepname: 'Preparation', 
    viscosity_en: '2.5 cP', 
    viscosity_vn: '2.5 cP',
    spec_en: 'Mix at room temperature',
    spec_vn: 'Trộn ở nhiệt độ phòng',
    holdTime: '30 min'
  },
  { 
    id: 'step2', 
    stepname: 'Heating', 
    viscosity_en: '1.8 cP', 
    viscosity_vn: '1.8 cP',
    spec_en: 'Heat to 80°C, maintain pressure',
    spec_vn: 'Đun nóng đến 80°C, duy trì áp suất',
    holdTime: '60 min'
  },
  { 
    id: 'step3', 
    stepname: 'Cooling', 
    viscosity_en: '3.2 cP', 
    viscosity_vn: '3.2 cP',
    spec_en: 'Cool gradually to 20°C',
    spec_vn: 'Làm lạnh dần về 20°C',
    holdTime: '45 min'
  },
];

export const chemicalTemplates: ChemicalTemplate[] = [
  {
    id: 'chem1',
    chemicalCode: 'CHEM-001',
    consumption: '10 L/hour',
    materials: [
      { 
        materialCode: 'MAT001', 
        materialName: 'Base Polymer', 
        ratio: '50%', 
        qty: '50', 
        unit: 'kg',
        checkResult: '',
        correctAction: '',
        te1Signature: '',
        customerSignature: ''
      },
      { 
        materialCode: 'MAT002', 
        materialName: 'Catalyst', 
        ratio: '10%', 
        qty: '5', 
        unit: 'kg',
        checkResult: '',
        correctAction: '',
        te1Signature: '',
        customerSignature: ''
      },
    ]
  },
  {
    id: 'chem2',
    chemicalCode: 'CHEM-002',
    consumption: '8 L/hour',
    materials: [
      { 
        materialCode: 'MAT003', 
        materialName: 'Advanced Polymer', 
        ratio: '70%', 
        qty: '60', 
        unit: 'kg',
        checkResult: '',
        correctAction: '',
        te1Signature: '',
        customerSignature: ''
      },
    ]
  },
];