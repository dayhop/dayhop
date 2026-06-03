import instance from '@/lib/api/instance';
import * as T from '@/types/api/myreservations-types';

// 예약 조회
export const getMyReservations = async ({
  teamId,
  cursorId,
  size,
  status,
}: T.GetMyReservationsParams): Promise<T.GetMyReservationsResponse> => {
  const { data } = await instance.get<T.GetMyReservationsResponse>(`/${teamId}/my-reservations`, {
    params: { cursorId, size, status },
  });
  return data;
};

// 예약 상태 변경 (취소 등)
export const patchMyReservation = async (
  { teamId, reservationId }: T.PatchMyReservationParams,
  body: T.PatchMyReservationBody
): Promise<T.PatchMyReservationResponse> => {
  const { data } = await instance.patch<T.PatchMyReservationResponse>(
    `/${teamId}/my-reservations/${reservationId}`,
    body
  );
  return data;
};

// 예약 신청 수정
export const patchMyReservationApplication = async (
  { teamId, reservationId }: T.PatchMyReservationParams, // Params 재사용 훌륭합니다!
  body: T.PatchMyReservationApplicationBody
): Promise<T.PatchMyReservationApplicationResponse> => {
  const { data } = await instance.patch<T.PatchMyReservationApplicationResponse>(
    `/${teamId}/my-reservations/${reservationId}/application`,
    body
  );
  return data;
};

// 리뷰 작성
export const postMyReservationReview = async (
  { teamId, reservationId }: T.PostMyReservationReviewParams,
  body: T.PostMyReservationReviewBody
): Promise<T.PostMyReservationReviewResponse> => {
  const { data } = await instance.post<T.PostMyReservationReviewResponse>(
    `/${teamId}/my-reservations/${reservationId}/reviews`,
    body
  );
  return data;
};
