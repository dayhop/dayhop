export type ActivityCategory = '문화 · 예술' | '식음료' | '스포츠' | '투어' | '관광' | '웰빙';

export interface GetActivitiesParams {
  method: 'cursor' | 'offset';
  cursorId?: number;
  category?: ActivityCategory;
  keyword?: string;
  sort?: 'most_reviewed' | 'price_asc' | 'price_desc' | 'latest';
  page?: number;
  size?: number;
}

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

export interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface ActivityResponse extends ActivityItem {
  subImages: SubImage[];
  schedules: Schedule[];
}

export interface GetActivitiesResponse {
  cursorId: number | null;
  totalCount: number;
  activities: ActivityItem[];
}

export interface PostActivitiesData {
  title: string;
  category: ActivityCategory;
  description: string;
  address: string;
  price: number;
  schedules: ActivityScheduleInput[];
  bannerImageUrl: string;
  subImageUrls: string[];
}

export type ActivityScheduleInput = {
  date: string;
  startTime: string;
  endTime: string;
};

export type ScheduleDate = {
  date: string;
  times: Omit<Schedule, 'date'>[];
};

export interface GetActivityAvailableScheduleParams {
  year: string;
  month: string;
}

export interface GetActivityAvailableScheduleResponse {
  date: string;
  times: Omit<Schedule, 'date'>[];
}

export interface GetActivityReviewsResponses {
  averageRating: number;
  totalCount: number;
  reviews: Reviews[];
}

export interface Reviews {
  id: number;
  user: User;
  activityId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type User = {
  profileImageUrl: string;
  nickname: string;
  id: number;
};

export interface PostActivityReservationsResponse {
  id: number;
  teamId: string;
  userId: number;
  activityId: number;
  scheduleId: number;
  status: Status;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export type Status = 'pending' | 'confirmed' | 'cancelled';

export interface GetActivityReviews {
  page?: number;
  size?: number;
}

export interface PostActivityReservationsData {
  scheduleId: number;
  headCount: number;
}

export interface PostActivitiesImageResponse {
  activityImageUrl: string;
}
