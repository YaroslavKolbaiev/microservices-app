import mongoose from 'mongoose';
import { Order, OrderStatus } from './Order';

/** ticket model is created in orders service in order to have reference
 * from orders model to ticket model
 * this is just a clone of ticket from application service
 */

interface TicketAttrs {
  title: string;
  price: number;
  /** to have same ID as TICKET DB, id received from attrs
   * must be assigned as _id proveperty of new Ticket in ORDER DB
   */
  id: string;
  version: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  /** create custom method in order to reuse it in different routes */
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  /** custom method to find ticket by id and version in ticket-updated-listener */
  findByIdAndVersion(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      /** assume price is always positive */
      min: 0,
    },
  },
  {
    versionKey: 'version',
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

/** custom method to find ticket by id and version in ticket-updated-listener */
ticketSchema.statics.findByIdAndVersion = (event: {
  id: string;
  version: number;
}) => {
  const ticket = Ticket.findOne({ _id: event.id, version: event.version - 1 });

  return ticket;
};

/** to create custom method in Model itself add method to statics object of mongoose  */
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  /** to have same ID as TICKET DB, id received from attrs
   * must be assigned as _id proveperty of new Ticket in ORDER DB
   */
  return new Ticket({
    /** before ticket created the default value _id is used */
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

/** to create custom method in Document - use 'methods'
 * IMPORTANT! use function instead of arrow in order to use 'THIS'
 */
ticketSchema.methods.isReserved = async function () {
  /** this - the ticket document that we just called 'isReserved' on */
  const existingOrder = await Order.findOne({
    ticket: this,
    /** $in is special MongoDD operator which means that status
     * is equal to any of given values from an array
     */
    status: {
      $in: [OrderStatus.CREATED, OrderStatus.AWAITING, OrderStatus.COMPLETE],
    },
  });

  return existingOrder;
};

const Ticket = mongoose.model<TicketAttrs, TicketModel>(
  'Order-Ticket',
  ticketSchema
);

export { Ticket };
