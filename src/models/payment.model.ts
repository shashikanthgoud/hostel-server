import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  aadharId: string;
  lastPaymentDate: Date | null;
  fees: number | null;
  amountPaid: number | null;
  totalAmountPaid: number | null;
  paymentType: string | null;
}

export interface IPaymentHistory extends Document {
    _id: string;
    aadharId: string;
    updatedFields: Partial<IPayment>;
    updatedBy: string;
    updatedDate: Date;
    __v: number;
}

const paymentSchema = new Schema<IPayment>({
  aadharId: {
    type: String,
    required: true,
    unique: true,
  },
  lastPaymentDate: {
    type: Date,
    default: null,
  },
  fees: {
    type: Number,
    default: null,
  },
  amountPaid: {
    type: Number,
    default: null,
  },
  totalAmountPaid: {
    type: Number,
    default: null,
  },
  paymentType: {
    type: String,
    default: null,
  },
});

const paymentHistorySchema = new Schema<IPaymentHistory>({
    aadharId: {
        type: String,
        required: true,
    },
    updatedFields: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedBy: String,
    updatedDate: {
        type: Date,
        default: Date.now,
    },
});

// Create a model for the Payment collection
const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

// Create a model for the Payment History collection
const PaymentHistory = mongoose.model<IPaymentHistory>('PaymentHistory', paymentHistorySchema);

export {Payment,PaymentHistory};
