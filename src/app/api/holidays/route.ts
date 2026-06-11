import axios from 'axios';
import { NextResponse } from 'next/server';

type HolidayItem = {
  dateName: string;
  locdate: number;
  isHoliday: 'Y' | 'N';
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const year = searchParams.get('year');
  const month = searchParams.get('month');

  if (!year || !month) {
    return NextResponse.json({ message: 'year, month가 필요합니다' }, { status: 400 });
  }

  const serviceKey = process.env.HOLIDAY_API_KEY;

  if (!serviceKey) {
    return NextResponse.json({ message: 'HOLIDAY_API_KEY가 없습니다.' }, { status: 500 });
  }

  const url = `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${serviceKey}&solYear=${year}&solMonth=${month}&_type=json`;

  try {
    const { data } = await axios.get(url);

    if (typeof data !== 'object' || data === null || !data.response) {
      return NextResponse.json(
        { message: '공휴일 API 응답이 올바르지 않습니다.' },
        { status: 502 }
      );
    }

    const item = data.response.body?.items?.item;

    const holidays: HolidayItem[] = Array.isArray(item) ? item : item ? [item] : [];

    return NextResponse.json(
      holidays
        .filter((holiday) => holiday.isHoliday === 'Y')
        .map((holiday) => ({
          name: holiday.dateName,
          date: String(holiday.locdate).replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3'),
        }))
    );
  } catch {
    return NextResponse.json(
      { message: '공휴일 정보를 불러오는데 실패했습니다.' },
      { status: 502 }
    );
  }
}
