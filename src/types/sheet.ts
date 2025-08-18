export interface Material {
  materialCode: string;
  materialName: string;
  ratio: string;
  qty: string;
  unit: string;
  checkResult: string;
  correctAction: string;
  te1Signature: string;
  customerSignature: string;
}

export interface StepTemplate {
  id: string;
  stepname: string;
  viscosity_en: string;
  viscosity_vn: string;
  spec_en: string;
  spec_vn: string;
  holdTime: string;
}

export interface ChemicalTemplate {
  id: string;
  chemicalCode: string;
  consumption: string;
  materials: Material[];
}

export interface ProductionRecord {
  id: string;
  booth: number | null;
  stepId: string;
  chemicalId: string;
  stepname: string;
  viscosity_en: string;
  viscosity_vn: string;
  spec_en: string;
  spec_vn: string;
  holdTime: string;
  chemicalCode: string;
  consumption: string;
  materials: Material[];
}