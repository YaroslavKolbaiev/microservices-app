import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { email, password, path } = request.body;

  console.log(path);

  // change to /api/application/ with kubernetes
  const res = await fetch(`http://localhost:3000/api/users/${path}`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-type': 'application/json',
    },
    credentials: 'include', // include credentials for local networking. WHY I REMOVED IT FOR KUBERNETES ???
  });

  const data = await res.json();

  if (!res.ok) {
    return response.status(500).send(data);
  }

  // OLD IMPLEMENTATION. JUST FOR YOUR REFERENCE.
  // IF REQUEST ON CLIENT SIDE YOU WANT TO THROW IN ORDER TO CATCH IT
  // if (!response.ok) {
  //   throw data.errors; // throws(another words 'returns like error') array of errors
  // }

  response.status(200).send(data);
}
