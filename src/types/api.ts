export type ActivityCategory = '문화 · 예술' | '식음료' | '스포츠' | '투어' | '관광' | '웰빙';

export interface ActivityItem {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: ActivityCategory;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubImage {
  id: number;
  imageUrl: string;
}

export type ActivityScheduleInput = {
  date: string;
  startTime: string;
  endTime: string;
};

export type ReservationStatus = 'pending' | 'confirmed' | 'declined' | 'canceled' | 'completed';

export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
