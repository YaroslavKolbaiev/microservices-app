import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { ticketId } = await request.json();

  const token = request.cookies.get('token');

  const res = await fetch(
    'http://orders-srv.default.svc.cluster.local:3000/api-service/orders',
    {
      method: 'POST',
      body: JSON.stringify({ ticketId }),
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
