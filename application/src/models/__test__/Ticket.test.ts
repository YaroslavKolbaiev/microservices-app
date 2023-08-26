import { Ticket } from '../Ticket';

it('runs optimistic concurency control', async () => {
  console.log('===START1===');
  const data = {
    title: 'Hello World!',
    price: 20,
    userId: 'íd-1',
  };

  const ticket = Ticket.build(data);

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();
  console.log(firstInstance);
  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error('Should not reach this point');
});

it('increments version by one', async () => {
  console.log('===START2===');
  const ticket = Ticket.build({
    title: 'UEFA final',
    price: 50,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  ticket.set({ title: 'FIFA final' });
  await ticket.save();
  expect(ticket.version).toEqual(1);
  ticket.set({ price: 35 });
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
