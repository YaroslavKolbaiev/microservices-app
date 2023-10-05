import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // change to /api/application/ with kubernetes
  try {
    const res = await fetch('http://localhost:3002/api/application/', {
      headers: {
        'Content-type': 'application/json',
      },
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
