import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { ticketId } = request.body;

  // change to /api/orders/ with kubernetes
  const res = await fetch('http://localhost:3003/api/orders/', {
    method: 'POST',
    body: JSON.stringify({ ticketId }),
    headers: {
      'Content-type': 'application/json',
      cookie: `${request.headers.cookie}`,
    },
    credentials: 'include', // include credentials for local networking. WHY I REMOVED IT FOR KUBERNETES ???
  });

  const data = await res.json();

  if (!res.ok) {
    return response.status(500).send(data);
  }

  response.status(201).send(data);
}
