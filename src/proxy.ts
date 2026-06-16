import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const accessToken = request.cookies.get('accessToken')?.value;

  //둘 다 없을 때
  if (!refreshToken && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  //엑세스x 리프레쉬o
  if (!accessToken && refreshToken) {
    try {
      //미들웨어에서는 fetch 함수 권장한다고 함, 토큰 재발급
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/tokens`, {
        method: 'POST',
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const response = NextResponse.next();
        response.cookies.set('accessToken', data.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 15,
        });

        //리퀘스트 객체도 수정 -> 안해주면 현재 요청에서 401 오류날 것
        request.cookies.set('accessToken', data.accessToken);
        return response;
      } else {
        //리프레쉬 토큰x 엑세스토큰x  -> 로그인으로 리다이렉트
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
      }
    } catch (error) {
      console.error('미들웨어 토큰 갱신 에러', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/edit-profile',
    '/reservation-list',
    '/my-experiences',
    '/experiences-add',
    '/experiences-edit',
    '/reservation-status',
    '/notification',
  ],
};
