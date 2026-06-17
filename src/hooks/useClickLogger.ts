import { ActivityCategory } from '@/types/api';

const userfitItem = {
  category: {
    '문화·예술': 0,
    식음료: 0,
    스포츠: 0,
    투어: 0,
    관광: 0,
    웰빙: 0,
  },
  clicksActivityLog: [],
};

export const useClickLogger = () => {
  const handleUpdateLog = (activityId: number, category: ActivityCategory) => {
    //로컬 스토리지에서 clicks라는 이름을 가져오거나 기본 데이터 포맷을 세팅 -> 업데이트 -> 다시 저장
    const log = JSON.parse(localStorage.getItem('clicks') || JSON.stringify(userfitItem));

    log.category[category] = (log.category[category] || 0) + 1;
    log.clicksActivityLog.push(activityId);
    localStorage.setItem('clicks', JSON.stringify(log));
  };
  return { handleUpdateLog };
};
