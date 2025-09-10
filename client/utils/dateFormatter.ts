
// Date formatting utilities for consistent dd-mm-yyyy format across the application

export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (!date || isNaN(date.getTime())) {
    return '';
  }
  
  const formatted = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit", 
    year: "numeric",
  });
  
  // Replace slashes with dashes
  return formatted.replace(/\//g, '-');
};

export const formatDateTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (!date || isNaN(date.getTime())) {
    return '';
  }
  
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

export const formatDateTimeWithSeconds = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (!date || isNaN(date.getTime())) {
    return '';
  }
  
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
};

// Parse dd-mm-yyyy format back to Date object
export const parseDateString = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  // Handle dd-mm-yyyy or dd/mm/yyyy format
  const parts = dateString.split(/[-\/]/);
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const year = parseInt(parts[2], 10);
  
  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? null : date;
};
