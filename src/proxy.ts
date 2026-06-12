import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.redirect('/login');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/edit-profile',
    '/reservation-list',
    '/my-experiences',
    '/experiences-add',
    '/experiences-edit',
    '/reservation-status',
    '/notification',
  ],
};
