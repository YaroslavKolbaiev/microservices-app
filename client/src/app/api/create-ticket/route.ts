import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { title, price } = await request.json();

  const token = request.cookies.get('token');

  try {
    // change to /api/application/ with kubernetes
    const res = await fetch('http://localhost:3002/api/application/', {
      method: 'POST',
      body: JSON.stringify({ title, price }),
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
  } catch (error) {
    return NextResponse.json(
      { errors: [{ message: 'Internal Server Error' }] },
      { status: 500 }
    );
  }
}
