import { serverInstance } from '@/lib/api/instance';
import { safeApi } from '@/lib/api/safeApi';
import { PatchMyReservationBody, PatchMyReservationResponse } from '@/lib/api/my-reservations/type';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  const { reservationId, ...body }: { reservationId: number } & PatchMyReservationBody =
    await request.json();

  const res = await safeApi(() =>
    serverInstance.patch<PatchMyReservationResponse>(`/my-reservations/${reservationId}`, body)
  );

  if (!res.success) {
    return NextResponse.json({ message: res.message }, { status: res.status ?? 500 });
  }

  return NextResponse.json(res.data);
}
