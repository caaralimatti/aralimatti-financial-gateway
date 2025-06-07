
import { useState } from 'react';

export const usePasswordVisibility = () => {
  const [showPassword, setShowPassword] = useState({
    itPassword: false,
    itDeductorPassword: false,
    tracesDeductorPassword: false,
    tracesTaxpayerPassword: false,
    mcaV2Password: false,
    mcaV3Password: false,
    dgftPassword: false,
    gstPassword: false
  });

  const togglePassword = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return { showPassword, togglePassword };
};
