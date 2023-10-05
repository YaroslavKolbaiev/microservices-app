import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { orderId, stripeId } = await request.json();

  const token = request.cookies.get('token');

  // change to /api/application/ with kubernetes
  const res = await fetch('http://localhost:3005/api/success/', {
    method: 'POST',
    body: JSON.stringify({ orderId, stripeId }),
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

  revalidatePath('/');

  return NextResponse.json(data, { status: 201 });
}
