import { useState } from 'react';

export interface PayslipCustomization {
  showGrossSalary: boolean;
  showAllowances: boolean;
  showDeductions: boolean;
  showTaxes: boolean;
  showBankDetails: boolean;
  showDepartmentInfo: boolean;
  templateColor: 'blue' | 'green' | 'purple' | 'slate';
}

const defaultCustomization: PayslipCustomization = {
  showGrossSalary: true,
  showAllowances: true,
  showDeductions: true,
  showTaxes: true,
  showBankDetails: true,
  showDepartmentInfo: true,
  templateColor: 'blue',
};

export function usePayslipCustomization() {
  const [customization, setCustomization] = useState<PayslipCustomization>(defaultCustomization);

  const toggleSection = (section: keyof Omit<PayslipCustomization, 'templateColor'>) => {
    setCustomization((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const setTemplateColor = (color: PayslipCustomization['templateColor']) => {
    setCustomization((prev) => ({
      ...prev,
      templateColor: color,
    }));
  };

  const resetCustomization = () => {
    setCustomization(defaultCustomization);
  };

  return {
    customization,
    toggleSection,
    setTemplateColor,
    resetCustomization,
  };
}
