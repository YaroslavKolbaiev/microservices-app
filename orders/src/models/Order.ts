import mongoose from 'mongoose';
import { OrderStatus } from '@irickmcrs/common';
import { TicketDoc } from './Order-Ticket';

/** in order to have one import statement for Order related  */
export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  /** ticket document is assigned as value of order */
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  /** ticket document is assigned as value of order */
  ticket: TicketDoc;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      /** whenever we try so set or update status
       * mongoos will use one of the values from OrderStatus enum
       */
      enum: Object.values(OrderStatus),
      /** optionaly set default status value */
      default: OrderStatus.CREATED,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    /** ticket document is assigned as value of order */
    ticket: {
      /** to use properties of other collections */
      type: mongoose.Schema.Types.ObjectId,
      /** reference to Ticket document */
      ref: 'Order-Ticket',
    },
  },
  {
    versionKey: 'version',
    optimisticConcurrency: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderAttrs, OrderModel>('Order', orderSchema);

export { Order };
