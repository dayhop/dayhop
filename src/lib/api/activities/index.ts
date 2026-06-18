'use server';

import { serverInstance } from '../instance';
import * as T from './type';

export async function getActivities(
  params: T.GetActivitiesParams
): Promise<T.GetActivitiesResponse> {
  const response = await serverInstance.get<T.GetActivitiesResponse>('/activities', { params });
  return response.data;
}

export async function postActivities(data: T.PostActivitiesData): Promise<T.ActivityResponse> {
  const response = await serverInstance.post<T.ActivityResponse>('/activities', data);
  return response.data;
}

export async function getActivity(activityId: number): Promise<T.ActivityResponse | null> {
  try {
    const response = await serverInstance.get<T.ActivityResponse>(`/activities/${activityId}`);
    return response.data;
  } catch (error) {
    console.warn(`Failed to get activity ${activityId}:`, error);
    return null;
  }
}

export async function getActivityAvailableSchedule(
  activityId: number,
  params: T.GetActivityAvailableScheduleParams
): Promise<T.GetActivityAvailableScheduleResponse | null> {
  try {
    const response = await serverInstance.get<T.GetActivityAvailableScheduleResponse>(
      `/activities/${activityId}/available-schedule`,
      { params }
    );
    return response.data;
  } catch {
    console.warn(`Failed to get available schedule for activity ${activityId}`);
    return null;
  }
}

export async function getActivityReviews(
  activityId: number,
  params?: T.GetActivityReviews
): Promise<T.GetActivityReviewsResponses> {
  const response = await serverInstance.get<T.GetActivityReviewsResponses>(
    `/activities/${activityId}/reviews`,
    { params }
  );
  return response.data;
}

export async function postActivityReservations(
  activityId: number,
  data: T.PostActivityReservationsData
): Promise<T.PostActivityReservationsResponse> {
  const response = await serverInstance.post<T.PostActivityReservationsResponse>(
    `/activities/${activityId}/reservations`,
    data
  );
  return response.data;
}

export async function postActivitiesImage(image: File): Promise<T.PostActivitiesImageResponse> {
  const formData = new FormData();
  formData.append('image', image);
  const response = await serverInstance.post<T.PostActivitiesImageResponse>(
    `/activities/image`,
    formData
  );
  return response.data;
}
