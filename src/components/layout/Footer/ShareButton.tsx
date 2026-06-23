'use client';

import ShareButton from '@/assets/icon/ShareIcon.svg';
import { showToast } from '@/utils/toast';

export function ShareBurron() {
  const handleClickShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DayHOP - 나만의 로컬 경험',
          text: '장소를 공유합니다.',
          url: window.location.href,
        });
        showToast.success('공유에 성공했습니다. ');
      } catch (error) {
        console.error('공유 취소 or 실패');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast.success('링크가 클립보드에 복사되었습니다. ');
      } catch {
        showToast.error('클립보드 복사 실패');
      }
    }
  };
  return <ShareButton onClick={handleClickShare} />;
}
