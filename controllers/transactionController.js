const catchAsync = require('../utils/catchAsync');
const Transaction = require('./../models/transactionModel');

exports.getAllTransaction = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions
    }
  });
});

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
