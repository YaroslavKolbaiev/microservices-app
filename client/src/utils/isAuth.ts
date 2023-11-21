export const isAuth = async (cookie: string) => {
  const res = await fetch(
    'http://auth-srv.default.svc.cluster.local:3000/api-service/users/current-user',
    {
      headers: {
        'Content-type': 'application/json',
        cookie,
      },
      credentials: 'include',
    }
  );

  const {currentUser} = await res.json();

  return currentUser;
}