import { TicketUpdatedEvent } from '@irickmcrs/common';
import { natsWrapper } from '../../../nats-wraper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/Order-Ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  // create an instance of a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    title: 'UEFA final',
    price: 50,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  // create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new title',
    price: 40,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('finds, updates and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();
  // call the onMessage method with data object + message object
  await listener.onMessage(data, msg);
  // find the ticket
  const updatedTicket = await Ticket.findById(ticket.id);
  // write assertions to make sure a ticket was created!
  expect(updatedTicket?.title).toEqual(data.title);
});

it('acks the message', async () => {
  const { listener, data, msg, ticket } = await setup();
  // call the onMessage method with data object + message object
  await listener.onMessage(data, msg);
  // write assertions to make sure a ticket is called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has wrong version', async () => {
  const { listener, data, msg, ticket } = await setup();
  data.version = 50;
  // call the onMessage method with data object + message object
  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
