import { Router, Request, Response } from 'express';
import {User, UserHistory} from '../models/user.model';
import { Payment } from '../models/payment.model';

const userRouter = Router();

// GET /users
userRouter.get('/', async (req: Request, res: Response) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /users/find/:aadharId
userRouter.get('/find/:aadharId', async (req: Request, res: Response) => {
    try {
      const { aadharId } = req.params;
  
      // Find the user by aadharId
      const user = await User.findOne({ aadharId });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

// POST /users
userRouter.post('/', async (req: Request, res: Response) => {
  try {
    // Create a new user
    const user = new User({ ...req.body });
    // Validate vacatedDate against admissionDate
    if (user.vacatedDate && user.admissionDate && user.vacatedDate < user.admissionDate) {
      return res.status(400).json({ message: 'Vacated date cannot be less than admission date' });
    }
    const savedUser = await user.save();

    const userHistoryEntry = new UserHistory({
      aadharId: user.aadharId,
      updatedFields: savedUser.toObject(),
      updatedBy: 'Admin'
    });

    await userHistoryEntry.save();

    // Create a payment entry for the user
    const newPayment = new Payment({
      aadharId: savedUser.aadharId,
      lastPaymentDate: null,
      fees: savedUser.fees,
      amountPaid: null,
      totalAmountPaid: null,
      paymentType: null,
    });
    await newPayment.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

//Update /users/:aadharId
userRouter.put('/:aadharId', async (req,res)=>{
    try{
        const {admissionDate, vacatedDate} = req.body;
        // Validate vacatedDate against admissionDate
        if (vacatedDate && admissionDate && vacatedDate < admissionDate) {
          return res.status(400).json({ message: 'Vacated date cannot be less than admission date' });
        }
        const updatedUser = await User.findOneAndUpdate({aadharId:req.params.aadharId},req.body,{new:true});
        if(!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userHistoryEntry = new UserHistory({
          aadharId: updatedUser.aadharId,
          updatedFields: updatedUser.toObject(),
          updatedBy: 'Admin'
        });
    
        await userHistoryEntry.save();

        // Update payment fees when the user is updated
        const { aadharId, fees } = req.body;
        await Payment.updateOne({ aadharId }, { fees });

        res.status(200).json(updatedUser);
    } catch(error) {  
        console.error(error);
        res.status(500).json({ message: 'Failed to update user' });
    }
});

// DELETE /users/:aadhardId user and its associated user history
userRouter.delete('/:aadharId', async (req: Request, res: Response) => {
    try {
      const { aadharId } = req.params;
      // Delete the user by aadhardId
      const result = await User.deleteOne({ aadharId });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Delete the user history entries associated with the user
      await UserHistory.deleteMany({ aadharId });
  
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Get user history for a particular user
userRouter.get('/history/:aadharId', async (req, res) => {
  try {
    const aadharId = req.params.aadharId;
    const user = await User.findOne({ aadharId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userHistory = await UserHistory.find({ aadharId }).sort({ updatedDate: -1 });

    res.json(userHistory);
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ error: 'Failed to fetch user history' });
  }
});
  
export default userRouter;
