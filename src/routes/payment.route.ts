import { Router, Request, Response } from 'express';
import { Payment, PaymentHistory  } from '../models/payment.model';
import { User } from '../models/user.model';

const paymentRouter = Router();

// Create a new payment
paymentRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newPayment = new Payment({ ...req.body });
    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Failed to create payment' });
  }
});

// Update an existing payment
paymentRouter.put('/:aadharId', async (req: Request, res: Response) => {
  try {
    const { aadharId } = req.params;
    const updatedPayment = await Payment.findOneAndUpdate({ aadharId }, req.body, { new: true });

    if (!updatedPayment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Update the user fields
    const { lastPaymentDate, fees, amountPaid, paymentType } = req.body;
    await User.findOneAndUpdate({ aadharId }, { lastPaymentDate, fees, amountPaid, paymentType });

    // Create payment history entry
    const paymentHistory = new PaymentHistory({
      aadharId,
      updatedFields: updatedPayment.toObject(),
      updatedBy: 'Admin',
    });
    await paymentHistory.save();

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// Delete a payment
paymentRouter.delete('/:aadharId', async (req: Request, res: Response) => {
  try {
    const { aadharId } = req.params;

    // Delete the payment
    const deletedPayment = await Payment.findOneAndDelete({ aadharId });

    if (!deletedPayment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Delete the payment history entries associated with the payment
    await PaymentHistory.deleteMany({ aadharId });

    res.json(deletedPayment);
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

// GET /payment/find/:aadharId
paymentRouter.get('/find/:aadharId', async (req: Request, res: Response) => {
  try {
    const { aadharId } = req.params;
    // Find the payment by aadharId
    const payment = await Payment.findOne({ aadharId });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET payment history of a user by Aadhar ID
paymentRouter.get('/history/:aadharId', async (req: Request, res: Response) => {
  try {
    const { aadharId } = req.params;
    const paymentHistory = await PaymentHistory.find({ aadharId }).sort({ updatedDate: 'desc' });

    res.json(paymentHistory);
  } catch (error) {
    console.error('Error retrieving payment history:', error);
    res.status(500).json({ error: 'Failed to retrieve payment history' });
  }
});

export default paymentRouter;
