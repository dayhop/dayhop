import { getActivity } from '@/lib/api/activities';
import { ActivityDetailClient } from '@/components/blocks/ActivityDetailClient';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout';

export default async function ActivityDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ owner?: string }>;
}) {
  const { id } = await params;
  const activityId = parseInt(id, 10);
  const resolvedSearchParams = (await searchParams) || {};

  if (isNaN(activityId)) {
    notFound();
  }

  const activity = await getActivity(activityId);
  const isMockOwner = resolvedSearchParams.owner === 'true';

  if (activity) {
    // If testing owner mode on a real activity, override userId
    const processedActivity = {
      ...activity,
      userId: isMockOwner ? -1 : activity.userId,
      subImages: activity.subImages || [],
      schedules: activity.schedules || [],
    };

    return (
      <>
        <Header />
        <ActivityDetailClient activity={processedActivity} />
      </>
    );
  }

  // Fallback mock data for testing if backend is down or ID does not exist
  const mockActivity = {
    id: activityId,
    userId: isMockOwner ? -1 : 9999, // -1 signals mockup ownership
    title: `[DayHOP] 함께 배우면 즐거운 스트릿 댄스 #${activityId}`,
    category: '문화 · 예술',
    price: 10000,
    rating: 4.8,
    reviewCount: 203,
    address: '서울 중구 청계천로 100 10F',
    description: `안녕하세요! 쿠터 스트릿 댄스 체험을 소개합니다. 저희는 신나고 재미있는 스트릿 댄스 스타일을 가르칩니다. 크럼프는 세계적으로 인기 있는 댄스 스타일로, 어디서든 춤출 수 있습니다. 저희 매칭에서는 새로운 스타일을 배우고, 즐거운 시간을 보낼 수 있습니다. 

저희와 함께 즐길 수 있는 시간을 기대해 주세요! 기품 있고 멋진 스탭들로 구성되어 있습니다. 초보자부터 전문가까지 즐겁게 출 수 있도록 준비해 두었습니다.`,
    bannerImageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800',
    subImages: [
      { id: 1, imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=400' },
      {
        id: 2,
        imageUrl: 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=400',
      },
      {
        id: 3,
        imageUrl: 'https://images.unsplash.com/photo-1535525153412-5a42439e210d?q=80&w=400',
      },
    ],
  };

  return (
    <>
      <Header />
      <div className="border-b border-orange-100 bg-orange-50 py-2.5 text-center text-xs font-medium text-orange-700">
        ⚠️ 등록되지 않은 체험 ID이거나 API 통신이 실패하여 테스트용 모의 데이터로 대체되었습니다.
        (수정 모드 테스트: URL 뒤에 <span className="font-bold underline">?owner=true</span> 추가)
      </div>
      <ActivityDetailClient activity={mockActivity} />
    </>
  );
}
