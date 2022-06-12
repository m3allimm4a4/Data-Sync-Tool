const prisma = require('../database/prisma');
const catchAsync = require('../errors/catchAsyncErrors');

exports.addToppings = catchAsync(async (req, res, next) => {
  const { data: toppings } = req.body;

  if (toppings.lenght === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'No toppings provided',
    });
  }

  await prisma.banannaTopings.createMany({
    data: toppings,
  });

  return res.status(201).json({
    status: 'success',
    message: 'Toppings created',
  });
});

exports.deleteAllToppings = catchAsync(async (req, res, next) => {
  await prisma.banannaTopings.deleteMany();

  return res.status(200).json({
    status: 'success',
    message: 'Toppings deleted',
  });
});
