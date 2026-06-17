export const useClickMost = () => {
  const handleUpdateMostClick = (activityId: number) => {
    const data = JSON.parse(localStorage.getItem('useActivity') || '{"clicks": {}}');
    data.clicks[activityId] = (data.clicks[activityId] || 0) + 1;
    localStorage.setItem('useActivity', JSON.stringify(data));
  };
  return { handleUpdateMostClick };
};
