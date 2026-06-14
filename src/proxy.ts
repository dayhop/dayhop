import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
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
