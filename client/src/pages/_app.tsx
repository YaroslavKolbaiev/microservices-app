import './globals.css';
import App, { AppContext, AppInitialProps, AppProps } from 'next/app';
import Head from 'next/head';
import { Nav } from '@/componetns';
import { CurrentUser } from '@/types/User';

type AppOwnProps = { props: { currentUser: CurrentUser } };

export default function MyApp({
  Component,
  pageProps,
  props,
}: AppProps & AppOwnProps) {
  return (
    <>
      <Head>
        <title>Microservices</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav currentUser={props.currentUser} />
      <Component {...pageProps} currentUser={props.currentUser} />
    </>
  );
}

MyApp.getInitialProps = async (
  context: AppContext
): Promise<AppOwnProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context);

  const res = await fetch('http://localhost:3000/api/users/current-user/', {
    credentials: 'include',
    headers: { cookie: context.ctx.req?.headers.cookie } as
      | HeadersInit
      | undefined,
  });

  const { currentUser } = await res.json();

  return { ...ctx, props: { currentUser } };
};
