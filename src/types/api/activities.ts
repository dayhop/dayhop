export interface GetActivitiesParams {
  method: 'cursor' | 'offset';
  cursorId?: number;
  category?: '문화 · 예술' | '식음료' | '스포츠' | '투어' | '관광' | '웰빙';
  keyword?: string;
  sort?: 'most_reviewed' | 'price_asc' | 'price_desc' | 'latest';
  page?: number;
  size?: number;
}

export interface GetActivitiesResponse {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: '문화 · 예술' | '식음료' | '스포츠' | '투어' | '관광' | '웰빙';
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostActivitiesData {
  title: string;
  category: string;
  description: string;
  address: string;
  price: number;
  schedules: Schedules[];
  bannerImageUrl: string;
  subImageUrls: string[];
}

export type Schedules = {
  date: string;
  startTime: string;
  endTime: string;
};

export interface PostActivitiesResponse {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;

  //@TODO 여기서부터 타입 작성

  subImages: [
    {
      imageUrl: 'string';
      id: 0;
    },
  ];
  schedules: [
    {
      times: [
        {
          endTime: 'string';
          startTime: 'string';
          id: 0;
        },
      ];
      date: 'string';
    },
  ];
}

export interface GetActivityAvailableScheduleParams {
  year: string;
  month: string;
}

export interface GetActivityReviews {
  page?: number;
  size?: number;
}

export interface postActivityReservationsData {
  scheduleId: number;
  headCount: number;
}
