'use client';
import * as T from '@/types/api/activities';
import instance from './instance';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQ4NiwidGVhbUlkIjoiMjMtMiIsImlhdCI6MTc4MDI5ODE5MSwiZXhwIjoxNzgwMjk5OTkxLCJpc3MiOiJzcC1nbG9iYWxub21hZCJ9.5mxhcOctyXh-gGZcXCYi2JfVIfcEzLebDlc8EgMyk4I';

//================================

export async function getActivities(params: T.GetActivitiesParams) {
  const response = await instance.get<T.GetActivitiesResponse>('/activities', { params });
  return response.data;
}

export async function postActivities(data: T.PostActivitiesData) {
  const response = await instance.post('/activities', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getActivity(activityId: number) {
  const response = await instance.get(`/activities/${activityId}`);
  return response.data;
}

export async function getActivityAvailableSchedule(
  activityId: number,
  params: T.GetActivityAvailableScheduleParams
) {
  const response = await instance.get(`/activities/${activityId}`, { params });
  return response.data;
}

export async function getActivityReviews(
  activityId: number,
  params?: { params: T.GetActivitiesParams }
) {
  const response = await instance.get(`/activities/${activityId}/reviews`, { params });
  return response.data;
}

export async function postActivityReservations(
  activityId: number,
  data: T.postActivityReservationsData
) {
  const response = await instance.post(`activities/${activityId}/reservations`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function postActivitiesImage(image: File) {
  const formData = new FormData();
  formData.append('image', image);
  const response = await instance.post(`activities/image`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
