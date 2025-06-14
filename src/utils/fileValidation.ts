
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.name.toLowerCase().endsWith('.csv')) {
    return { isValid: false, error: 'Please upload a CSV file only' };
  }

  // Check file size (10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { isValid: false, error: 'File size should be less than 10MB' };
  }

  // Check if file is empty
  if (file.size === 0) {
    return { isValid: false, error: 'The uploaded file is empty' };
  }

  return { isValid: true };
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidMobile = (mobile: string): boolean => {
  const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanMobile = mobile.replace(/[\s\-\(\)]/g, '');
  return mobileRegex.test(cleanMobile) && cleanMobile.length >= 10;
};
