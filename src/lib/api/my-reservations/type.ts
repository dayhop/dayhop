import type { ReservationStatus } from '@/types/api';
export type { ReservationStatus };

export interface Activity {
  id: number;
  userId: number;
  title: string;
  bannerImageUrl: string;
}

export interface Reservation {
  id: number;
  teamId: string;
  userId: number;
  activity: Activity;
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

export interface GetMyReservationsParams {
  cursorId?: number;
  size?: number;
  status?: ReservationStatus;
}

export interface GetMyReservationsResponse {
  cursorId: number | null;
  reservations: Reservation[];
  totalCount: number;
}

export interface PatchMyReservationParams {
  reservationId: number;
}

export interface PatchMyReservationBody {
  status: 'canceled';
}

export type PatchMyReservationResponse = Reservation;

export interface PatchMyReservationApplicationBody {
  scheduleId: number;
  headCount: number;
}

export type PatchMyReservationApplicationResponse = Reservation;

export interface PostMyReservationReviewParams {
  reservationId: number;
}

export interface PostMyReservationReviewBody {
  rating: number;
  content: string;
}

export interface PostMyReservationReviewResponse {
  id: number;
  teamId: string;
  activityId: number;
  userId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}
