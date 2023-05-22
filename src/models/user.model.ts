import mongoose, { Document, Schema } from 'mongoose';

// Create an interface for the User document
interface IUser extends Document {
  aadharId: string;
  name: string;
  dob: Date;
  email: string;
  phone: string;
  alternatePhone: string;
  fatherName: string;
  address: string;
  status: string;
  gender: string;
  institute: string;
  roomNumber: number;
  admissionDate: Date;
  vacatedDate: Date;
  lastPaymentDate: Date;
  createdDate: Date;
  updatedDate: Date;
  hostel: string;
  fees:number;
  amountPaid:number;
  paymentType:string;
}

// Create an interface for the User History document
interface IUserHistory extends Document {
  _id: string;
  aadharId: string;
  updatedFields: Partial<IUser>;
  updatedBy: string;
  updatedDate: Date;
  __v: number;
}

const validateVacatedDate = (value: Date | undefined, doc:any): boolean => {
  const admissionDate = doc? doc.admissionDate : null;
  if (!value || !admissionDate) {
    return true; // Skip validation if either value is missing
  }
  return value >= admissionDate;
};


// Create a schema for the User collection
const userSchema: Schema<IUser> = new mongoose.Schema({
  aadharId: { type: String, unique: true, required: true },
  name: String,
  dob: { type: Date, default: null },
  email: String,
  phone: String,
  alternatePhone: String,
  fatherName: String,
  address: String,
  status: String,
  gender: String,
  institute: String,
  roomNumber: Number,
  admissionDate: { type: Date, default: null },
  vacatedDate: { type: Date, default: null,
    validate: {
      validator: validateVacatedDate,
      message: 'Vacated date cannot be less than admission date',
    }
  },
  lastPaymentDate: { type: Date, default: null },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  hostel: String,
  fees: Number,
  amountPaid: Number,
  paymentType: String
});

// Creates a schema for the User history
const userHistorySchema = new mongoose.Schema({
  aadharId: { type: String, required: true },
  updatedFields: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedBy: String,
  updatedDate: { type: Date, default: Date.now }
});


// Create a model for the User collection
const User = mongoose.model<IUser>('User', userSchema);

const UserHistory = mongoose.model<IUserHistory>('UserHistory', userHistorySchema);


export  { User, UserHistory };
