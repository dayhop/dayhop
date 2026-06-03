export type ReservationStatus = 'pending' | 'confirmed' | 'declined' | 'canceled' | 'completed';

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
  teamId: string;
  cursorId?: number | null;
  size?: number;
  status?: ReservationStatus;
}

export interface GetMyReservationsResponse {
  cursorId: number | null;
  reservations: Reservation[];
  totalCount: number;
}

export interface PatchMyReservationParams {
  teamId: string;
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
  teamId: string;
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
