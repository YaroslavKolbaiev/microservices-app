import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { ticketId } = await request.json();

  const token = request.cookies.get('token');

  // change to /api/orders/ with kubernetes
  const res = await fetch('http://localhost:3003/api/orders/', {
    method: 'POST',
    body: JSON.stringify({ ticketId }),
    headers: {
      'Content-type': 'application/json',
      cookie: `${token?.value}`,
    },
    credentials: 'include', // include credentials for local networking. WHY I REMOVED IT FOR KUBERNETES ???
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
