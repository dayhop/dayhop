import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const accessToken = request.cookies.get('accessToken')?.value;

  const needAuthorization = ['/mypage', '/activity-add', '/activity-edit'];

  const isAuthorizationpage = needAuthorization.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  //인증이 필요한 페이지 && 엑세스 리프레쉬 모두 없으면 로그인 페이지로 리다이렉트 시킴
  if (isAuthorizationpage && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  //엑세스x 리프레쉬o
  if (!accessToken && refreshToken) {
    try {
      //미들웨어에서는 fetch 함수 권장한다고 함, 토큰 재발급
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/tokens`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const response = NextResponse.rewrite(request.nextUrl);
        response.cookies.set('accessToken', data.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 15,
        });

        return response;
      } else {
        //res.ok가 false(갱신 실패)고 보호받는 페이지라면 토큰 지우고 로그인으로
        if (isAuthorizationpage) {
          const response = NextResponse.redirect(new URL('/login', request.url));
          response.cookies.delete('accessToken');
          response.cookies.delete('refreshToken');
          return response;
        }
      }
    } catch (error) {
      console.error('미들웨어 토큰 갱신 에러', error);
      //보호받는 페이지라면 이동
      if (isAuthorizationpage) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|login).*)'],
};
