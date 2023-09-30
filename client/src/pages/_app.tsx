import './globals.css';
import App, { AppContext, AppInitialProps, AppProps } from 'next/app';
import Head from 'next/head';
import { Nav } from '@/componetns';
import { CurrentUser } from '@/types/User';
import { ProgressProvider } from '@/Context/UserContext';

type AppOwnProps = { props: { currentUser: CurrentUser } };

export default function MyApp({
  Component,
  pageProps,
  props,
}: AppProps & AppOwnProps) {
  return (
    <ProgressProvider>
      <Head>
        <title>Microservices</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav currentUser={props.currentUser} />
      <Component {...pageProps} currentUser={props.currentUser} />
    </ProgressProvider>
  );
}

MyApp.getInitialProps = async (
  context: AppContext
): Promise<AppOwnProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context);

  // for local networking
  const res = await fetch('http://localhost:3000/api/users/current-user/', {
    credentials: 'include',
    headers: { cookie: context.ctx.req?.headers.cookie } as
      | HeadersInit
      | undefined,
  });

  // for kubernetes =>
  // let res;

  // /** 'ingress-nginx-controller.ingress-nginx.svc.cluster.local' to be used from server component */
  // if (typeof window === 'undefined') {
  //   res = await fetch(
  //     'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/current-user/',
  //     {
  //       credentials: 'include',
  //       // headers: {
  //       //   // Host: 'microservices.dev',
  //       //   cookie: context.ctx.req?.headers.cookie,
  //       // } as HeadersInit | undefined,
  //       headers: context.ctx.req?.headers as HeadersInit,
  //     }
  //   );
  // } else {
  //   /** if request comes from client use '/api/users/current-user'*/
  //   res = await fetch('/api/users/current-user');
  // }

  // <=

  const { currentUser } = await res.json();
  return { ...ctx, props: { currentUser } };
};
