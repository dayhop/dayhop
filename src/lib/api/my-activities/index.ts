'use server';

import { AxiosRequestConfig } from 'axios';
import * as T from './type';
import { serverInstance } from '../instance';

export async function getMyActivities(
  params?: T.GetMyActivitiesParams,
  config?: AxiosRequestConfig
): Promise<T.GetMyActivitiesResponse> {
  const response = await serverInstance.get<T.GetMyActivitiesResponse>('/my-activities', {
    params,
    ...config,
  });
  return response.data;
}

export async function getMyActivityReservationDashboard(
  activityId: number,
  params: T.GetMyActivityReservationDashboardParams,
  config?: AxiosRequestConfig
): Promise<T.GetMyActivityReservationDashboardResponse[]> {
  const response = await serverInstance.get<T.GetMyActivityReservationDashboardResponse[]>(
    `/my-activities/${activityId}/reservation-dashboard`,
    {
      params,
      ...config,
    }
  );
  return response.data;
}

export async function getMyActivityReservedSchedule(
  activityId: number,
  params: T.GetMyActivityReservedScheduleParams,
  config?: AxiosRequestConfig
): Promise<T.GetMyActivityReservedScheduleResponse[]> {
  const response = await serverInstance.get<T.GetMyActivityReservedScheduleResponse[]>(
    `/my-activities/${activityId}/reserved-schedule`,
    {
      params,
      ...config,
    }
  );
  return response.data;
}

export async function getMyActivityReservations(
  activityId: number,
  params: T.GetMyActivityReservationsParams,
  config?: AxiosRequestConfig
): Promise<T.GetMyActivityReservationsResponse> {
  const response = await serverInstance.get<T.GetMyActivityReservationsResponse>(
    `/my-activities/${activityId}/reservations`,
    {
      params,
      ...config,
    }
  );
  return response.data;
}

export async function patchMyActivityReservationStatus(
  activityId: number,
  reservationId: number,
  body: T.PatchMyActivityReservationStatusRequest,
  config?: AxiosRequestConfig
): Promise<T.PatchMyActivityReservationStatusResponse> {
  const response = await serverInstance.patch<T.PatchMyActivityReservationStatusResponse>(
    `/my-activities/${activityId}/reservations/${reservationId}`,
    body,
    config
  );
  return response.data;
}

export async function deleteMyActivity(
  activityId: number,
  config?: AxiosRequestConfig
): Promise<void> {
  await serverInstance.delete(`/my-activities/${activityId}`, config);
}

export async function patchMyActivity(
  activityId: number,
  body: T.PatchMyActivityRequest,
  config?: AxiosRequestConfig
): Promise<T.PatchMyActivityResponse> {
  const response = await serverInstance.patch<T.PatchMyActivityResponse>(
    `/my-activities/${activityId}`,
    body,
    config
  );
  return response.data;
}
