import * as T from '@/types/api/my-activities';
import instance from './instance';

export async function getMyActivities(
  params?: T.GetMyActivitiesParams
): Promise<T.GetMyActivitiesResponse> {
  const response = await instance.get<T.GetMyActivitiesResponse>('/my-activities', { params });
  return response.data;
}

export async function getMyActivityReservationDashboard(
  activityId: number,
  params: T.GetMyActivityReservationDashboardParams
): Promise<T.GetMyActivityReservationDashboardResponse[]> {
  const response = await instance.get<T.GetMyActivityReservationDashboardResponse[]>(
    `/my-activities/${activityId}/reservation-dashboard`,
    { params }
  );
  return response.data;
}

export async function getMyActivityReservedSchedule(
  activityId: number,
  params: T.GetMyActivityReservedScheduleParams
): Promise<T.GetMyActivityReservedScheduleResponse[]> {
  const response = await instance.get<T.GetMyActivityReservedScheduleResponse[]>(
    `/my-activities/${activityId}/reserved-schedule`,
    { params }
  );
  return response.data;
}

export async function getMyActivityReservations(
  activityId: number,
  params: T.GetMyActivityReservationsParams
): Promise<T.GetMyActivityReservationsResponse> {
  const response = await instance.get<T.GetMyActivityReservationsResponse>(
    `/my-activities/${activityId}/reservations`,
    { params }
  );
  return response.data;
}

export async function patchMyActivityReservationStatus(
  activityId: number,
  reservationId: number,
  body: T.PatchMyActivityReservationStatusRequest
): Promise<T.PatchMyActivityReservationStatusResponse> {
  const response = await instance.patch<T.PatchMyActivityReservationStatusResponse>(
    `/my-activities/${activityId}/reservations/${reservationId}`,
    body
  );
  return response.data;
}

export async function deleteMyActivity(activityId: number): Promise<void> {
  await instance.delete(`/my-activities/${activityId}`);
}

export async function patchMyActivity(
  activityId: number,
  body: T.PatchMyActivityRequest
): Promise<T.PatchMyActivityResponse> {
  const response = await instance.patch<T.PatchMyActivityResponse>(
    `/my-activities/${activityId}`,
    body
  );
  return response.data;
}
