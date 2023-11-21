import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookieStore = cookies();

  const token = cookieStore.get('token');

  const res = await fetch(
    'http://auth-srv.default.svc.cluster.local:3000/api-service/users/current-user',
    {
      credentials: 'include',
      headers: { cookie: token?.value } as HeadersInit,
    }
  );

  const { currentUser } = await res.json();

  if (currentUser) {
    return NextResponse.next();
  }

  const redirectHome = new URL('/sign-in', request.url);
  return NextResponse.redirect(redirectHome);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/orders/:path*', '/tickets/:path*'],
};
