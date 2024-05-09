const mongoose = require('mongoose');
const User = require('./userModel');
// const validator = require('validator');

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: [true, 'A transaction must have a no'],
      unique: true,
      trim: true,
      maxlength: [9, 'A transasction no must have more than 9 characters'],
      minlength: [8, 'A transasction no must have less than 8 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    branch: {
      type: Number,
      required: [true, 'A transaction must have a branch']
    },
    type: {
      type: String,
      required: [true, 'A tour must have a type'],
      enum: {
        values: ['earned', 'redeem'],
        message: 'Type is either: earned, redeem'
      }
    },
    userId: {
      type: String,
      required: [true, 'A transaction must have a userId']
    },
    points: {
      type: Number,
      required: [true, 'A transaction must have a points']
    },
    amount: {
      type: Number,
      required: [true, 'A transaction must have a amount']
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    }
  }
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true }
  // }
);

// Middleware to update user's total points after saving a transaction
transactionSchema.pre('save', { validateBeforeSave: false }, async function(
  next
) {
  try {
    const user = await User.findById(this.userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (this.type === 'earned') {
      user.totalPoints += this.points;
    } else if (this.type === 'redeem') {
      if (user.totalPoints < this.points) {
        throw new Error(
          'Insufficient points for redeeming. Transaction not saved.'
        );
      }

      user.totalPoints -= this.points;
    }

    // Save the updated user document without validation
    await user.save({ validateBeforeSave: false });
    next();
  } catch (error) {
    next(error);
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
