import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // change to /api/application/ with kubernetes
  // const res = await fetch('http://localhost:3002/api/application/', {
  //   method: 'GET',
  //   headers: {
  //     'Content-type': 'application/json',
  //   },
  // });

  // const data = await res.json();

  // if (!res.ok) {
  //   return response.status(500).send(data);
  // }

  // response.status(201).send(data);
  try {
    const res = await fetch('http://localhost:3002/api/application/', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return response.status(500).send(data);
    }

    response.status(201).send(data);
  } catch (error) {
    response
      .status(500)
      .send({ errors: [{ message: 'Internal Server Error' }] });
  }
}
