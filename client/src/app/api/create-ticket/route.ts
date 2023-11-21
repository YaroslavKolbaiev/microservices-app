import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { title, price } = await request.json();

  const token = request.cookies.get('token');

  try {
    const res = await fetch(
      'http://application-srv.default.svc.cluster.local:3000/api-service/application',
      {
        method: 'POST',
        body: JSON.stringify({ title, price }),
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
  } catch (error) {
    return NextResponse.json(
      { errors: [{ message: 'Internal Server Error' }] },
      { status: 500 }
    );
  }
}
