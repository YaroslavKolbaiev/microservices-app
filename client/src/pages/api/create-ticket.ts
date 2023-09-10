import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { title, price } = request.body;

  // change to /api/application/ with kubernetes
  const res = await fetch('http://localhost:3002/api/application/', {
    method: 'POST',
    body: JSON.stringify({ title, price }),
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
