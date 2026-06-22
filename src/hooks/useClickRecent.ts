export const useClickRecent = () => {
  const MAX_ITEMS = 3;
  const handleUpdateRecentClick = (activityId: number) => {
    const storedData = localStorage.getItem('recentActivities');
    let recentList: number[] = [];

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        recentList = Array.isArray(parsed) ? parsed : [];
      } catch {
        recentList = [];
      }
    }

    recentList = recentList.filter((id) => id !== activityId);
    recentList.unshift(activityId);

    //최대 갯수 초과 시
    if (recentList.length > MAX_ITEMS) {
      recentList.pop();
    }

    localStorage.setItem('recentActivities', JSON.stringify(recentList));

    window.dispatchEvent(new Event('recentActivitiesUpdated'));
  };
  return { handleUpdateRecentClick };
};
