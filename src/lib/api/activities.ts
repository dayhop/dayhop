import * as T from '@/types/api/activities-types';
import instance from './instance';

//================================

const token = process.env.NEXT_PUBLIC_API_TOKEN;

export async function getActivities(
  params: T.GetActivitiesParams
): Promise<T.GetActivitiesResponse> {
  const response = await instance.get<T.GetActivitiesResponse>('/activities', { params });
  return response.data;
}

export async function postActivities(
  data: T.PostActivitiesData
): Promise<T.PostActivitiesResponse> {
  const response = await instance.post<T.PostActivitiesResponse>('/activities', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function postActivitiesImage(image: File): Promise<T.PostActivitiesImageResponse> {
  const formData = new FormData();
  formData.append('image', image);
  const response = await instance.post<T.PostActivitiesImageResponse>(
    `/activities/image`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}
