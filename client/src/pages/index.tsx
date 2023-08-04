import { CurrentUser } from '@/types/User';

export default function Home({ currentUser }: { currentUser: CurrentUser }) {
  return currentUser ? (
    <div className="">Hello {currentUser.email}</div>
  ) : (
    <h1>Please proceed to login page</h1>
  );
}
