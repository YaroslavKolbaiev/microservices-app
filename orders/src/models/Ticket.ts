import mongoose from 'mongoose';
import { Order, OrderStatus } from './Order';

/** ticket model is created in orders service in order to have reference
 * from orders model to ticket model
 */

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  /** create custom method in order to reuse it in different routes */
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
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
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

/** to create custom method in Model itself - use 'statics' */
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
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

const Ticket = mongoose.model<TicketAttrs, TicketModel>('Ticket', ticketSchema);

export { Ticket };
