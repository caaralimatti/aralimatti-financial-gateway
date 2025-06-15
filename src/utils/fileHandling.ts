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

// Proper debounce mechanism to prevent double execution
const viewingFiles = new Set<string>();

export const handleFileView = async (
  fileUrl: string,
  fileName: string,
  fileType: string
): Promise<void> => {
  const fileId = `${fileUrl}-${fileName}`;
  if (viewingFiles.has(fileId)) {
    console.log('File view already in progress, skipping...', fileName);
    return;
  }

  viewingFiles.add(fileId);

  try {
    if (isViewableInBrowser(fileType)) {
      // For viewable files, fetch the blob and create an object URL
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const typedBlob = new Blob([blob], { type: getFileContentType(fileType) });
      const blobUrl = URL.createObjectURL(typedBlob);

      // Open the blob URL in a new window
      const newWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer');
      console.log('window.open called:', !!newWindow);

      // If popup blocked or window didn't open, fallback ONLY if window.open returns null
      if (!newWindow) {
        console.log('window.open failed; using fallback anchor method');
        const link = document.createElement('a');
        link.href = blobUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Cleanup the blob URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 10000);

    } else {
      // For non-viewable files, trigger download
      handleFileDownload(fileUrl, fileName);
    }
  } catch (error) {
    console.error('Error viewing file:', error);
    // Fallback to download if view fails
    handleFileDownload(fileUrl, fileName);
  } finally {
    setTimeout(() => {
      viewingFiles.delete(fileId);
    }, 2000);
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
