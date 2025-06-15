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
  const now = Date.now();
  if (viewingFiles.has(fileId)) {
    console.log(`[FileView] Already in progress for ${fileName} @ ${now}`);
    return;
  }
  viewingFiles.add(fileId);
  console.log(`[FileView] START for ${fileName} (${fileType}) at ${now}`);

  try {
    if (isViewableInBrowser(fileType)) {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const typedBlob = new Blob([blob], { type: getFileContentType(fileType) });
      const blobUrl = URL.createObjectURL(typedBlob);

      // Only try one approach: Try window.open and trust the browser.
      // If window.open is blocked (returns null), do NOT try fallback.
      // If window.open is undefined (very rare), try fallback.
      let newWindow: Window | null | undefined = undefined;
      try {
        newWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer');
        console.log(`[FileView] window.open called:`, typeof newWindow, newWindow);
      } catch (err) {
        // Some browsers might throw if blocked by popup blocker
        console.log(`[FileView] window.open threw:`, err);
      }

      // Fallback only if window.open is literally "undefined"
      if (typeof newWindow === "undefined") {
        console.log(`[FileView] Fallback anchor method triggered for ${fileName} (window.open undefined)`);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // If null (blocked) or object (success), don't try fallback. Let browser handle.
      }

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 10000);
    } else {
      // Non-viewable — download
      handleFileDownload(fileUrl, fileName);
    }
  } catch (error) {
    console.error(`[FileView] Exception:`, error);
    handleFileDownload(fileUrl, fileName);
  } finally {
    setTimeout(() => {
      viewingFiles.delete(fileId);
      console.log(`[FileView] Cleared debounce for ${fileName} at ${Date.now()}`);
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
