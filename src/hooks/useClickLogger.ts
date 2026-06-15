export const useClickLogger = () => {
  const handleUpdateLog = (activityId: number) => {
    const data = JSON.parse(localStorage.getItem('useActivity') || '{"clicks": {}}');
    data.clicks[activityId] = (data.clicks[activityId] || 0) + 1;
    localStorage.setItem('useActivity', JSON.stringify(data));
  };
  return { handleUpdateLog };
};
