import { TicketsBoard } from '@/componetns';
import { CurrentUser } from '@/types/User';

export default function Home() {
  return (
    <div className="max-w-7xl px-5 mx-auto">
      <TicketsBoard />
    </div>
  );
}
