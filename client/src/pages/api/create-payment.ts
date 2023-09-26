import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { orderId } = request.body;

  // change to /api/application/ with kubernetes
  const res = await fetch('http://localhost:3005/api/payment/', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
    headers: {
      'Content-type': 'application/json',
      cookie: `${request.cookies.token}`,
    },
    credentials: 'include', // include credentials for local networking. WHY I REMOVED IT FOR KUBERNETES ???
  });

  const data = await res.json();

  console.log('[DATA IN API]', data);

  if (!res.ok) {
    return response.status(500).send(data);
  }

  response.status(201).send(data);
}
