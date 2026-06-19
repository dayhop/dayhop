'use server';

import { AxiosRequestConfig } from 'axios';
import * as T from './type';
import { serverInstance } from '../instance';
import { safeApi } from '../safeApi';
import type { ApiResult } from '../result';

export async function getMyActivities(
  params?: T.GetMyActivitiesParams,
  config?: AxiosRequestConfig
): Promise<ApiResult<T.GetMyActivitiesResponse>> {
  return safeApi(() =>
    serverInstance.get<T.GetMyActivitiesResponse>('/my-activities', {
      params,
      ...config,
    })
  );
}

export async function getMyActivityReservationDashboard(
  activityId: number,
  params: T.GetMyActivityReservationDashboardParams,
  config?: AxiosRequestConfig
): Promise<ApiResult<T.GetMyActivityReservationDashboardResponse[]>> {
  return safeApi(() =>
    serverInstance.get<T.GetMyActivityReservationDashboardResponse[]>(
      `/my-activities/${activityId}/reservation-dashboard`,
      {
        params,
        ...config,
      }
    )
  );
}

export async function getMyActivityReservedSchedule(
  activityId: number,
  params: T.GetMyActivityReservedScheduleParams,
  config?: AxiosRequestConfig
): Promise<ApiResult<T.GetMyActivityReservedScheduleResponse[]>> {
  return safeApi(() =>
    serverInstance.get<T.GetMyActivityReservedScheduleResponse[]>(
      `/my-activities/${activityId}/reserved-schedule`,
      {
        params,
        ...config,
      }
    )
  );
}

export async function getMyActivityReservations(
  activityId: number,
  params: T.GetMyActivityReservationsParams,
  config?: AxiosRequestConfig
): Promise<ApiResult<T.GetMyActivityReservationsResponse>> {
  return safeApi(() =>
    serverInstance.get<T.GetMyActivityReservationsResponse>(
      `/my-activities/${activityId}/reservations`,
      {
        params,
        ...config,
      }
    )
  );
}

export async function patchMyActivityReservationStatus(
  activityId: number,
  reservationId: number,
  body: T.PatchMyActivityReservationStatusRequest,
  config?: AxiosRequestConfig
): Promise<ApiResult<T.PatchMyActivityReservationStatusResponse>> {
  return safeApi(() =>
    serverInstance.patch<T.PatchMyActivityReservationStatusResponse>(
      `/my-activities/${activityId}/reservations/${reservationId}`,
      body,
      config
    )
  );
}

export async function deleteMyActivity(
  activityId: number,
  config?: AxiosRequestConfig
): Promise<ApiResult<void>> {
  return safeApi(() => serverInstance.delete<void>(`/my-activities/${activityId}`, config));
}

export async function patchMyActivity(
  activityId: number,
  body: T.PatchMyActivityRequest,
  config?: AxiosRequestConfig
): Promise<ApiResult<T.PatchMyActivityResponse>> {
  return safeApi(() =>
    serverInstance.patch<T.PatchMyActivityResponse>(`/my-activities/${activityId}`, body, config)
  );
}
