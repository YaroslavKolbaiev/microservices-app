import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token');

  const res = await fetch(
    'http://auth-srv.default.svc.cluster.local:3000/api-service/users/current-user',
    {
      headers: {
        'Content-type': 'application/json',
        cookie: `${token?.value}`,
      },
      credentials: 'include',
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
