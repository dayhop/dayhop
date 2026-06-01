'use client';
import {
  getActivities,
  getActivity,
  getActivityAvailableSchedule,
  getActivityReviews,
  postActivities,
  postActivitiesImage,
  postActivityReservations,
} from '@/lib/api/activies';
import { useEffect } from 'react';

export default function SignUp() {
  const data = {
    scheduleId: 0,
    headCount: 0,
  };

  useEffect(() => {
    const testApi = async () => {
      const dummyContent = 'fake image data';
      const dummyBlob = new Blob([dummyContent], { type: 'image/png' });
      const dummyFile = new File([dummyBlob], 'dummy-image.png', { type: 'image/png' });

      // 2. 함수 호출
      try {
        const response = await postActivitiesImage(dummyFile);
        console.log('업로드 성공:', response);
      } catch (error) {
        console.error('업로드 실패:', error);
      }
    };

    testApi();
  }, []);

  return <h1>로그인하세요</h1>;
}
