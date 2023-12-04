const calculateRemainingDays = (completionDate: Date): number => {
  const currentDate = new Date();
  const completionDateObj = new Date(completionDate);
  const timeDifference = completionDateObj.getTime() - currentDate.getTime();
  const remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
  return remainingDays;
};

export { calculateRemainingDays as getDays };

export const today = new Date().toISOString().split('T')[0];
