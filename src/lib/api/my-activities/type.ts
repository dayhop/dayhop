import type { ActivityCategory, ActivityItem, SubImage, ActivityScheduleInput, ReservationStatus } from '@/types/api';
export type { ActivityCategory, ActivityItem, SubImage, ActivityScheduleInput, ReservationStatus };

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

export interface GetMyActivityReservationDashboardParams {
  year: string;
  month: string;
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

export interface GetMyActivityReservedScheduleParams {
  date: string;
}

export interface GetMyActivityReservedScheduleResponse {
  scheduleId: number;
  startTime: string;
  endTime: string;
  count: ReservedScheduleCount;
}

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
