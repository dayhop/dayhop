import type {
  ActivityCategory,
  ActivityItem,
  SubImage,
  ActivityScheduleInput,
  ReservationStatus,
} from '@/types/api';
export type { ActivityCategory, ActivityItem, SubImage, ActivityScheduleInput, ReservationStatus };

export interface GetActivitiesParams {
  method: 'cursor' | 'offset';
  cursorId?: number;
  category?: ActivityCategory;
  keyword?: string;
  sort?: 'most_reviewed' | 'price_asc' | 'price_desc' | 'latest';
  page?: number;
  size?: number;
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
  user: ReviewUser;
  activityId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type ReviewUser = {
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
  status: ReservationStatus;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

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
