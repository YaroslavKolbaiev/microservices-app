export const authRequest = async (
  url: string,
  method: string,
  email?: string,
  password?: string
) => {
  // change fetch adress when using kubernetes
  const response = await fetch(url, {
    method,
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw data.errors; // throws(another words 'returns like error') array of errors
  }

  return data;
};
