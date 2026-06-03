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

export interface GetMyActivitiesParams {
  cursorId?: number;
  size?: number;
}

export interface GetMyActivitiesResponse {
  cursorId: number | null;
  totalCount: number;
  activities: ActivityItem[];
}

export interface ReservationCount {
  pending: number;
  confirmed: number;
  completed: number;
}

export interface GetMyActivityReservationDashboardResponse {
  date: string;
  reservations: ReservationCount;
}

export interface ReservedScheduleCount {
  declined: number;
  confirmed: number;
  pending: number;
}

export interface GetMyActivityReservedScheduleResponse {
  scheduleId: number;
  startTime: string;
  endTime: string;
  count: ReservedScheduleCount;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'declined' | 'canceled' | 'completed';

export interface MyActivityReservation {
  id: number;
  nickname: string;
  userId: number;
  teamId: string;
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

export interface GetMyActivityReservationsParams {
  cursorId?: number;
  size?: number;
  scheduleId: number;
  status: 'pending' | 'confirmed' | 'declined';
}

export interface GetMyActivityReservationsResponse {
  cursorId: number | null;
  totalCount: number;
  reservations: MyActivityReservation[];
}

export interface PatchMyActivityReservationStatusRequest {
  status: 'confirmed' | 'declined';
}

export type PatchMyActivityReservationStatusResponse = MyActivityReservation;

export interface ActivityScheduleInput {
  date: string;
  startTime: string;
  endTime: string;
}

export interface PatchMyActivityRequest {
  title?: string;
  category?: ActivityCategory;
  description?: string;
  price?: number;
  address?: string;
  bannerImageUrl?: string;
  subImageIdsToRemove?: number[];
  subImageUrlsToAdd?: string[];
  scheduleIdsToRemove?: number[];
  schedulesToAdd?: ActivityScheduleInput[];
}

export interface SubImage {
  id: number;
  imageUrl: string;
}

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
}

export interface Schedule {
  date: string;
  times: TimeSlot[];
}

export interface PatchMyActivityResponse extends ActivityItem {
  subImages: SubImage[];
  schedules: Schedule[];
}
