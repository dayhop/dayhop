'use server';
import { serverInstance } from '../instance';
import * as T from './type';

export const getMyReservations = async (
  params?: T.GetMyReservationsParams
): Promise<T.GetMyReservationsResponse> => {
  const { data } = await serverInstance.get<T.GetMyReservationsResponse>('/my-reservations', {
    params,
  });
  return data;
};

export const patchMyReservation = async (
  { reservationId }: T.PatchMyReservationParams,
  body: T.PatchMyReservationBody
): Promise<T.PatchMyReservationResponse> => {
  const { data } = await serverInstance.patch<T.PatchMyReservationResponse>(
    `/my-reservations/${reservationId}`,
    body
  );
  return data;
};

export const patchMyReservationApplication = async (
  { reservationId }: T.PatchMyReservationParams,
  body: T.PatchMyReservationApplicationBody
): Promise<T.PatchMyReservationApplicationResponse> => {
  const { data } = await serverInstance.patch<T.PatchMyReservationApplicationResponse>(
    `/my-reservations/${reservationId}/application`,
    body
  );
  return data;
};

export const postMyReservationReview = async (
  { reservationId }: T.PostMyReservationReviewParams,
  body: T.PostMyReservationReviewBody
): Promise<T.PostMyReservationReviewResponse> => {
  const { data } = await serverInstance.post<T.PostMyReservationReviewResponse>(
    `/my-reservations/${reservationId}/reviews`,
    body
  );
  return data;
};
