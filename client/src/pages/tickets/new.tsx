import TicketForm from '@/componetns/TicketForm/TicketForm';

export default function NewBook() {
  return (
    <section className="max-w-xl mx-auto px-6 mt-10">
      <h1 className="text-3xl font-bold text-center mb-5 dark:text-white">
        Create New Ticket
      </h1>
      <TicketForm />
    </section>
  );
}
