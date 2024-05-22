const catchAsync = require('../utils/catchAsync');
const Transaction = require('./../models/transactionModel');

exports.getAllTransaction = catchAsync(async (req, res, next) => {
  const userId = req.user._id; // Get userId from the request object (populated by protect middleware)

  // Find transactions for the specific user
  const transactions = await Transaction.find({ userId });

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions
    }
  });
});

// exports.getAllTransaction = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.user.id);

//   console.log('UserId', user);

//   const transactions = await Transaction.find({ user });

//   if (!user) {
//     return next(new AppError('No user found with this ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     results: transactions.length,
//     data: {
//       transactions
//     }
//   });
// });

exports.createTransaction = catchAsync(async (req, res, next) => {
  try {
    const newTransaction = await Transaction.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        transaction: newTransaction
      }
    });
  } catch (error) {
    // Handle errors thrown during transaction creation
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Internal Server Error'
    });
  }
});
