'use server';

import { serverInstance } from '../instance';
import { safeApi } from '../safeApi';
import type { ApiResult } from '../result';
import * as T from './type';

export async function getActivities(
  params: T.GetActivitiesParams
): Promise<ApiResult<T.GetActivitiesResponse>> {
  return safeApi(() => serverInstance.get<T.GetActivitiesResponse>('/activities', { params }));
}

export async function postActivities(
  data: T.PostActivitiesData
): Promise<ApiResult<T.ActivityResponse>> {
  return safeApi(() => serverInstance.post<T.ActivityResponse>('/activities', data));
}

export async function getActivity(activityId: number): Promise<ApiResult<T.ActivityResponse>> {
  return safeApi(() => serverInstance.get<T.ActivityResponse>(`/activities/${activityId}`));
}

export async function getActivityAvailableSchedule(
  activityId: number,
  params: T.GetActivityAvailableScheduleParams
): Promise<ApiResult<T.GetActivityAvailableScheduleResponse>> {
  return safeApi(() =>
    serverInstance.get<T.GetActivityAvailableScheduleResponse>(
      `/activities/${activityId}/available-schedule`,
      { params }
    )
  );
}

export async function getActivityReviews(
  activityId: number,
  params?: T.GetActivityReviews
): Promise<ApiResult<T.GetActivityReviewsResponses>> {
  return safeApi(() =>
    serverInstance.get<T.GetActivityReviewsResponses>(`/activities/${activityId}/reviews`, {
      params,
    })
  );
}

export async function postActivityReservations(
  activityId: number,
  data: T.PostActivityReservationsData
): Promise<ApiResult<T.PostActivityReservationsResponse>> {
  return safeApi(() =>
    serverInstance.post<T.PostActivityReservationsResponse>(
      `/activities/${activityId}/reservations`,
      data
    )
  );
}

export async function postActivitiesImage(
  image: File
): Promise<ApiResult<T.PostActivitiesImageResponse>> {
  return safeApi(() => {
    const formData = new FormData();
    formData.append('image', image);
    return serverInstance.post<T.PostActivitiesImageResponse>(`/activities/image`, formData);
  });
}
