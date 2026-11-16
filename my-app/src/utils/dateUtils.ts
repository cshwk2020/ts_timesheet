
export const getWeekRangeForDate = (dateInput: Date | string) => {
  const date = new Date(dateInput);
  const day = date.getDay();
  const diffToMonday = date.getDate() - day + (day === 0 ? -6 : 1);
  
  const monday = new Date(date);
  monday.setDate(diffToMonday);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    startDate: monday.toISOString().split("T")[0],
    endDate: sunday.toISOString().split("T")[0],
    today: date.toISOString().split("T")[0],
  };
};

export const getCurrentWeekRange = () => {
  return getWeekRangeForDate(new Date());
};