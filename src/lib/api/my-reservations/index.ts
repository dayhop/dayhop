'use server';
import { serverInstance } from '../instance';
import { safeApi } from '../safeApi';
import type { ApiResult } from '../result';
import * as T from './type';

export const getMyReservations = async (
  params?: T.GetMyReservationsParams
): Promise<ApiResult<T.GetMyReservationsResponse>> =>
  safeApi(() =>
    serverInstance.get<T.GetMyReservationsResponse>('/my-reservations', {
      params,
    })
  );

export const patchMyReservation = async (
  { reservationId }: T.PatchMyReservationParams,
  body: T.PatchMyReservationBody
): Promise<ApiResult<T.PatchMyReservationResponse>> =>
  safeApi(() =>
    serverInstance.patch<T.PatchMyReservationResponse>(`/my-reservations/${reservationId}`, body)
  );

export const patchMyReservationApplication = async (
  { reservationId }: T.PatchMyReservationParams,
  body: T.PatchMyReservationApplicationBody
): Promise<ApiResult<T.PatchMyReservationApplicationResponse>> =>
  safeApi(() =>
    serverInstance.patch<T.PatchMyReservationApplicationResponse>(
      `/my-reservations/${reservationId}/application`,
      body
    )
  );

export const postMyReservationReview = async (
  { reservationId }: T.PostMyReservationReviewParams,
  body: T.PostMyReservationReviewBody
): Promise<ApiResult<T.PostMyReservationReviewResponse>> =>
  safeApi(() =>
    serverInstance.post<T.PostMyReservationReviewResponse>(
      `/my-reservations/${reservationId}/reviews`,
      body
    )
  );
