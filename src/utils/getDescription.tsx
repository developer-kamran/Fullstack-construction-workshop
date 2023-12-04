export const truncateDescription = (description: string) => {
  const maxLength = 30; // Adjust as needed
  return description.slice(0, maxLength) + '...';
};
