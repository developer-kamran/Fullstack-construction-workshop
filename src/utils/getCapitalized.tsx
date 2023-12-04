const formatServiceType = (serviceType: string): string => {
  return serviceType
    .replace(/_/g, ' ') // Replace underscores with spaces
    .toLowerCase() // Convert to lowercase
    .split(' ') // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' ');
};

export { formatServiceType as capitalized };
