'use client';

import { useEffect, useState } from 'react';

import { ActivityCardContainer } from '@/components/blocks/Main/ActivityCardContainer';

import { getActivities } from '@/lib/api/activities';
import { ActivityCategory, ActivityItem } from '@/types/api';
import { getMyUser } from '@/lib/api/users';

/**
 * 단어의 마지막 글자에 받침(종성)이 있는지에 따라 '을' 또는 '를'을 반환합니다.
 * @param word 조사를 붙일 단어
 * @returns '을' 또는 '를'
 */
const getObjectParticle = (word: string) => {
  const lastChar = word.charCodeAt(word.length - 1);
  // 한글 범위(가-힣)가 아니거나 받침이 없으면 '를'을 반환
  return lastChar < 0xac00 || lastChar > 0xd7a3 || (lastChar - 0xac00) % 28 === 0 ? '를' : '을';
};

export function Userfit() {
  const [activitiesList, setActivitiesList] = useState<ActivityItem[]>([]);
  const [userNickname, setUserNickname] = useState<string>('');
  const [topcategory, setTopcategory] = useState<ActivityCategory>();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fetchActivities = async () => {
      //선호 카테고리가 뭔지 알아내고 거기서 안 본 것 골라내기
      const response = localStorage.getItem('clicks');
      if (!response) return;
      const userfit = JSON.parse(response).category;
      const userfitCategory = Object.entries(userfit)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .map(([id]) => id)
        .slice(0, 1)
        .pop() as ActivityCategory;

      if (userfitCategory) {
        setTopcategory(userfitCategory);
      }

      //요청
      const fitcategorydata = await getActivities({
        method: 'cursor',
        category: userfitCategory, // 상태 대신 지역 변수를 사용해야 합니다.
        size: 10,
      });

      //봤던 상품
      const alreadyshow = JSON.parse(response).clicksActivityLog;
      const viewedIdSet = new Set(alreadyshow);

      const userfitItems = fitcategorydata.activities.filter((item) => !viewedIdSet.has(item.id));

      // 다보면기록 리셋
      if (userfitItems.length === 0) {
        localStorage.removeItem('clicks');
        setActivitiesList(fitcategorydata.activities.slice(0, 4));
      } else {
        setActivitiesList(userfitItems.slice(0, 4));
      }

      const getNickname = async () => {
        const user = await getMyUser();
        setUserNickname(user.nickname);
      };
      try {
        await getNickname();
      } catch {}
    };
    fetchActivities();
  }, []);

  if (activitiesList.length === 0) return null;

  //비로그인일시 '회원님'
  const username = userNickname || '회원';

  const title = topcategory
    ? `${topcategory}${getObjectParticle(topcategory)} 좋아하시는 ${username}님에게 딱 맞는!`
    : `${username}님을 위한 맞춤 추천!`;

  return (
    <div>
      <ActivityCardContainer title={title} activitiesList={activitiesList} />
    </div>
  );
}
