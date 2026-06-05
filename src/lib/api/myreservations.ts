import instance from '@/lib/api/instance';
import * as T from '@/types/api/myreservations-types';

// 예약 목록 조회
export const getMyReservations = async ({
  cursorId,
  size,
  status,
}: T.GetMyReservationsParams): Promise<T.GetMyReservationsResponse> => {
  const { data } = await instance.get<T.GetMyReservationsResponse>('/my-reservations', {
    params: { cursorId, size, status },
  });
  return data;
};

// 예약 상태 변경 (취소 등)
export const patchMyReservation = async (
  { reservationId }: T.PatchMyReservationParams,
  body: T.PatchMyReservationBody
): Promise<T.PatchMyReservationResponse> => {
  const { data } = await instance.patch<T.PatchMyReservationResponse>(
    `/my-reservations/${reservationId}`,
    body
  );
  return data;
};

// 예약 신청 수정
export const patchMyReservationApplication = async (
  { reservationId }: T.PatchMyReservationParams,
  body: T.PatchMyReservationApplicationBody
): Promise<T.PatchMyReservationApplicationResponse> => {
  const { data } = await instance.patch<T.PatchMyReservationApplicationResponse>(
    `/my-reservations/${reservationId}/application`,
    body
  );
  return data;
};

// 리뷰 작성
export const postMyReservationReview = async (
  { reservationId }: T.PostMyReservationReviewParams,
  body: T.PostMyReservationReviewBody
): Promise<T.PostMyReservationReviewResponse> => {
  const { data } = await instance.post<T.PostMyReservationReviewResponse>(
    `/my-reservations/${reservationId}/reviews`,
    body
  );
  return data;
};
