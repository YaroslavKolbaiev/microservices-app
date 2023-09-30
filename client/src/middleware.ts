import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const hasCookie = request.cookies.get('token')?.value;

  if (hasCookie === 'expired' || !hasCookie) {
    return NextResponse.next();
  }

  const redireHome = new URL('/', request.url);
  return NextResponse.redirect(redireHome);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/sign-in/:path*', '/sign-up/:path*'],
};
