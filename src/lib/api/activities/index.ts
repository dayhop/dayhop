import * as T from './type';
import instance from '../instance';

export async function getActivities(
  params: T.GetActivitiesParams
): Promise<T.GetActivitiesResponse> {
  const response = await instance.get<T.GetActivitiesResponse>('/activities', { params });
  return response.data;
}

export async function postActivities(data: T.PostActivitiesData): Promise<T.ActivityResponse> {
  const response = await instance.post<T.ActivityResponse>('/activities', data);
  return response.data;
}

export async function getActivity(activityId: number): Promise<T.ActivityResponse> {
  const response = await instance.get<T.ActivityResponse>(`/activities/${activityId}`);
  return response.data;
}

export async function getActivityAvailableSchedule(
  activityId: number,
  params: T.GetActivityAvailableScheduleParams
): Promise<T.GetActivityAvailableScheduleResponse> {
  const response = await instance.get<T.GetActivityAvailableScheduleResponse>(
    `/activities/${activityId}/available-schedule`,
    { params }
  );
  return response.data;
}

export async function getActivityReviews(
  activityId: number,
  params?: T.GetActivityReviews
): Promise<T.GetActivityReviewsResponses> {
  const response = await instance.get<T.GetActivityReviewsResponses>(
    `/activities/${activityId}/reviews`,
    { params }
  );
  return response.data;
}

export async function postActivityReservations(
  activityId: number,
  data: T.PostActivityReservationsData
): Promise<T.PostActivityReservationsResponse> {
  const response = await instance.post<T.PostActivityReservationsResponse>(
    `/activities/${activityId}/reservations`,
    data
  );
  return response.data;
}

export async function postActivitiesImage(image: File): Promise<T.PostActivitiesImageResponse> {
  const formData = new FormData();
  formData.append('image', image);
  const response = await instance.post<T.PostActivitiesImageResponse>(
    `/activities/image`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}
