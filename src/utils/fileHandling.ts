
export const getFileContentType = (fileType: string): string => {
  const mimeTypes: Record<string, string> = {
    'image/jpeg': 'image/jpeg',
    'image/jpg': 'image/jpeg',
    'image/png': 'image/png',
    'application/pdf': 'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };
  
  return mimeTypes[fileType] || fileType || 'application/octet-stream';
};

export const isViewableInBrowser = (fileType: string): boolean => {
  const viewableTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/pdf'
  ];
  
  return viewableTypes.includes(fileType);
};

export const handleFileView = async (fileUrl: string, fileName: string, fileType: string): Promise<void> => {
  try {
    if (isViewableInBrowser(fileType)) {
      // Create a clean URL without any query parameters that might interfere
      const cleanUrl = fileUrl.split('?')[0];
      
      // For PDFs and images, we need to ensure they open with proper headers
      // Instead of direct navigation which might have caching issues, 
      // we'll create a proper link with download prevention
      const viewUrl = `${cleanUrl}?response-content-disposition=inline&response-content-type=${encodeURIComponent(getFileContentType(fileType))}`;
      
      // Open in new tab with proper settings
      const newWindow = window.open(viewUrl, '_blank', 'noopener,noreferrer');
      
      if (!newWindow) {
        // If popup blocked, fallback to creating a link
        const link = document.createElement('a');
        link.href = viewUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      // For non-viewable files, trigger download
      handleFileDownload(fileUrl, fileName);
    }
  } catch (error) {
    console.error('Error viewing file:', error);
    // Fallback to download if view fails
    handleFileDownload(fileUrl, fileName);
  }
};

export const handleFileDownload = async (fileUrl: string, fileName: string): Promise<void> => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    // Fallback: direct link approach
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
