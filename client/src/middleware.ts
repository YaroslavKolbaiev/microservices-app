import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const hasCookie = request.headers.get('cookie');

  if (hasCookie) {
    const redireHome = new URL('/', request.url);
    return NextResponse.redirect(redireHome);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/sign-in/:path*', '/sign-up/:path*'],
};
