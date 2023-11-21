import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { orderId } = await request.json();

  const token = request.cookies.get('token');

  const res = await fetch(
    'http://payment-srv.default.svc.cluster.local:3000/api-service/payment/',
    {
      method: 'POST',
      body: JSON.stringify({ orderId }),
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

  return NextResponse.json(data, { status: 201 });
}
